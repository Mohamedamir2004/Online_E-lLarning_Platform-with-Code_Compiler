const MeetIcon = ({ className = "h-8 w-8 text-yellow-25" }) => {
  const meetUrl = "https://meet.google.com/new";

  return (
    <a
      href={meetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Google Meet"
      className={`inline-flex items-center justify-center rounded-md hover:bg-richblack-700 p-1 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-full w-full"
      >
        <path d="M17.25 10.5V7.5C17.25 5.95507 16.0449 4.75 14.5 4.75H5.75C4.20507 4.75 3 5.95507 3 7.5V16.5C3 18.0449 4.20507 19.25 5.75 19.25H14.5C16.0449 19.25 17.25 18.0449 17.25 16.5V13.5L21 16.5V7.5L17.25 10.5Z" />
      </svg>
    </a>
  );
};

export default MeetIcon;
