export function createCircle(radius: number, precision: number): number[] {
	const coordinates = [];
	const angle = 360 / precision;
	let angleCounter = 0;
	while (angleCounter < 360) {
		// get current angle counter
		const angleRad = (angleCounter * Math.PI) / 180;
		// Vertex 1
		const x1 = 0;
		const y1 = 0;
		// Vertex 2 (along the x-axis relative to vertex 1)
		const x2 = 0 + Math.cos(angleRad) * radius;
		const y2 = 0 + Math.sin(angleRad) * radius;
		angleCounter += angle;
		// Vertex 3 (along the x-axis relative to vertex 1)
		const angleRadNext = (angleCounter * Math.PI) / 180;
		const x3 = 0 + Math.cos(angleRadNext) * radius;
		const y3 = 0 + Math.sin(angleRadNext) * radius;
		coordinates.push(x1, y1, x2, y2, x3, y3);
	}
	return coordinates;
}
