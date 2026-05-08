import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Check if there's any data to display
  const hasStudentData = chartDataStudents.datasets[0].data.some(value => value > 0)
  const hasIncomeData = chartIncomeData.datasets[0].data.some(value => value > 0)

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    elements: {
      arc: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#1a1a1a", // dark border to highlight slices
      },
    },
    plugins: {
      tooltip: {
        yAlign: "bottom",
      },
    },
    responsive: true,
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-4 lg:p-6">
      <p className="text-base lg:text-lg font-bold text-richblack-5">Visualize</p>

      <div className="flex flex-wrap gap-2 lg:gap-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-2 lg:px-3 text-sm lg:text-base transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>

        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-2 lg:px-3 text-sm lg:text-base transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      <div className="relative mx-auto w-full aspect-square max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-none lg:aspect-square lg:h-full lg:w-full min-h-[200px]">
        {/* always render pie chart if any courses exist */}
        {currChart === "students" ? (
          <>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-full">
              <Pie data={chartDataStudents} options={options} />
            </div>
            {!hasStudentData && courses.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-sm lg:text-lg font-medium text-richblack-200 px-4">
                  No students data yet
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-full">
              <Pie data={chartIncomeData} options={options} />
            </div>
            {!hasIncomeData && courses.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-sm lg:text-lg font-medium text-richblack-200 px-4">
                  No income data yet
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
