export interface ITriangle {
	geometryType: "triangle";
	value: Float32Array;
}

export interface ILine {
	geometryType: "line";
	value: Float32Array;
}

export interface IPoint {
	geometryType: "point";
	value: Float32Array;
}

export type Geometry = ITriangle | ILine | IPoint;
