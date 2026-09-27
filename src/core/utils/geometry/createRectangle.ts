export function createRectangle(
	xLength: number,
	yLength: number,
): Float32Array {
	return new Float32Array([
		// premier triangle
		0,
		0,
		0,
		0 + yLength,
		0 + xLength,
		0 + yLength,
		// second triangle
		0,
		0,
		0 + xLength,
		0,
		0 + xLength,
		0 + yLength,
	]);
}
