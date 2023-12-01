const  helper = () => {
	const color = [
			{
				label: "Not Started",
				color: "#A9A9A9",
				key: "ns"
			},
			{
				label: "On Hold",
				color: "#776B5D",
				key: "oh"
			},
			{
				label: "Assigned",
				color: "#96B6C5",
				key: "a"
			},
			{
				label: "In Porgress",
				color: "#3876BF",
				key: "ip"
			},
			{
				label: "In Review",
				color: "#A7D397",
				key: "ir"
			},
			{
				label: "QA Validation",
				color: "#6A9C89",
				key: "qa"
			},
			{
				label: "Done",
				color: "#186F65",
				key: "d"
			},
		]
	return {
		status:color
	}
}

export default helper