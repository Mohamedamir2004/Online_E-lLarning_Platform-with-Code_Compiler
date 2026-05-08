const Loading = () => {
	return (
		<div className="flex items-center justify-center">
			<div
				className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-25"
				role="status"
				aria-label="loading"
			/>
		</div>
	);
};

export default Loading;
