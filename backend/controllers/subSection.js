const Section = require('../models/section');
const SubSection = require('../models/subSection');
const { uploadImageToCloudinary } = require('../utils/imageUploader');



// ================ create SubSection ================
exports.createSubSection = async (req, res) => {
    try {
        // extract data
        const { title, description, sectionId } = req.body;

        // extract video file
        const videoFile = req.files?.video
        // console.log('videoFile ', videoFile)

        // validation
        if (!title || !description || !videoFile || !sectionId) {
            console.warn('createSubSection missing field:', {
                titleExists: !!title,
                descriptionExists: !!description,
                videoFileExists: !!videoFile,
                sectionIdExists: !!sectionId,
                body: req.body,
                files: req.files,
            });
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // upload video to cloudinary
        let videoUrl = null;
        let timeDuration = "0:00";
        
        try {
            console.log('Uploading video to Cloudinary...');
            const videoFileDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
            
            if (!videoFileDetails || !videoFileDetails.secure_url) {
                throw new Error('Video upload returned empty response');
            }
            
            videoUrl = videoFileDetails.secure_url;
            timeDuration = videoFileDetails.duration || "0:00";
            console.log('Video successfully uploaded to Cloudinary:', videoUrl);
        } catch (error) {
            console.error('Video upload to Cloudinary failed:', error.message);
            return res.status(400).json({
                success: false,
                message: 'Failed to upload video. Please try again.',
                error: error.message
            })
        }

        // create entry in DB
        const SubSectionDetails = await SubSection.create(
            { title, timeDuration, description, videoUrl })

        // link subsection id to section
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        // return response
        res.status(200).json({
            success: true,
            data: updatedSection,
            message: 'SubSection created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating SubSection');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating SubSection'
        })
    }
}



// ================ Update SubSection ================
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;

        // validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'subSection ID is required to update'
            });
        }

        // find in DB
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        // add data
        if (title) {
            subSection.title = title;
        }

        if (description) {
            subSection.description = description;
        }

        // upload video to cloudinary
        if (req.files && req.files.video) {
            const video = req.files.video;
            try {
                console.log('Uploading updated video to Cloudinary...');
                const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
                
                if (!uploadDetails || !uploadDetails.secure_url) {
                    throw new Error('Video upload returned empty response');
                }
                
                subSection.videoUrl = uploadDetails.secure_url;
                subSection.timeDuration = uploadDetails.duration || subSection.timeDuration;
                console.log('Video successfully updated in Cloudinary:', subSection.videoUrl);
            } catch (error) {
                console.error('Video update failed:', error.message);
                return res.status(400).json({
                    success: false,
                    message: 'Failed to update video. Please try again.',
                    error: error.message
                })
            }
        }

        // save data to DB
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        console.error('Error while updating the section')
        console.error(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating the section",
        })
    }
}



// ================ Delete SubSection ================
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )

        // delete from DB
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate('subSection')

        // In frontned we have to take care - when subsection is deleted we are sending ,
        // only section data not full course details as we do in others 

        // success response
        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,

            error: error.message,
            message: "An error occurred while deleting the SubSection",
        })
    }
}