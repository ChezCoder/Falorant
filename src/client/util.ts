import { Vector2 } from "three";

export namespace Utils {
    export function measureTextMetrics(ctx: CanvasRenderingContext2D, text: string, fontStyle: string): TextMetrics {
        const oldFont = ctx.font;
        ctx.font = fontStyle;
        const textm = ctx.measureText(text);
        ctx.font = oldFont;
        return textm;
    }
    
    export function measureTextHeight(ctx: CanvasRenderingContext2D, text: string, fontStyle: string): number {
        const metrics = measureTextMetrics(ctx, text, fontStyle);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    export function measureTextWidth(ctx: CanvasRenderingContext2D, text: string, fontStyle: string): number {
        return measureTextMetrics(ctx, text, fontStyle).width;
    }

    export function rbgToHex(red: number, blue: number, green: number): string {
        return `#${prefixSpacing(red.toString(16), "0", 2)}${prefixSpacing(blue.toString(16), "0", 2)}${prefixSpacing(green.toString(16), "0", 2)}`;
    }

    export function rbgaToHex(red: number, blue: number, green: number, alpha: number): string {
        return `#${prefixSpacing(red.toString(16), "0", 2)}${prefixSpacing(blue.toString(16), "0", 2)}${prefixSpacing(green.toString(16), "0", 2)}${prefixSpacing((Math.round(255 * alpha)).toString(16), "0", 2)}`;
    }

    export function clamp(n: number, min: number = 0, max: number = 100): number {
        return Math.max(min, Math.min(n, max));
    }

    export function prefixSpacing(text: string, prefix: string, length: number): string {
        if (text.length >= length) return text;
        return prefix.repeat(length - text.length) + text;
    }

    export function suffixSpacing(text: string, suffix: string, length: number): string {
        if (text.length >= length) return text;
        return text + suffix.repeat(length - text.length);
    }

    export function between(n: number, min: number, max: number): boolean {
        min = Math.min.apply(Math, [min, max]);
        max = Math.max.apply(Math, [min, max]);
        return n > min && n < max;
    }

    export function isPositionOnLine(pos: Vector2, linePos1: Vector2, linePos2: Vector2, fault: number = 1): boolean {
        const posFromLinePoints = pos.distanceTo(linePos1) + pos.distanceTo(linePos2);
        const lineLength = linePos1.distanceTo(linePos2);
        return between(posFromLinePoints, lineLength - fault, lineLength + fault);
    }
    
    export function isLineIntersectingLine(lp1: Vector2, lp2: Vector2, lp3: Vector2, lp4: Vector2): boolean {
        let a = lp1.x,
            b = lp1.y,
            c = lp2.x,
            d = lp2.y,
            p = lp3.x,
            q = lp3.y,
            r = lp4.x,
            s = lp4.y;
    
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    
    }

    export function isPointInRectangle(point: Vector2, rectPos: Vector2, width: number, height: number): boolean {
        return between(point.x, rectPos.x, rectPos.x + width) && between(point.y, rectPos.y, rectPos.y + height);
    }
    
    export function isPointInPolygon(point: Vector2, polygon: Vector2[], globalWidth: number, globalHeight: number): boolean {
        let xIntersections = 0;
        let yIntersections = 0;
        let testLineX = [point, new Vector2(globalWidth, point.y)];
        let testLineY = [point, new Vector2(point.x, globalHeight)];
    
        polygon.forEach((position, posi) => {
            if (posi == (polygon.length - 1)) return;
            
            if (isLineIntersectingLine(testLineX[0], testLineX[1], position, polygon[posi + 1]))
                xIntersections++;
            
            if (isLineIntersectingLine(testLineY[0], testLineY[1], position, polygon[posi + 1]))
                yIntersections++;
        });
    
        return (xIntersections % 2 === 1) && (yIntersections % 2 === 1);
    }
    
    export function pointCircleCollide(point: Vector2, circle: Vector2, radius: number) {
        if (radius === 0) return false;
        var dx = circle.x - point.x;
        var dy = circle.y - point.y;
        return dx * dx + dy * dy <= radius;
    }

    export function lineCircleCollide(lineSegment: [Vector2, Vector2], circle: Vector2, radius: number) {
        let t: Vector2 = new Vector2(0, 0);
        let nearest: Vector2 = new Vector2(0, 0);
    
        if (pointCircleCollide(lineSegment[0], circle, radius) || pointCircleCollide(lineSegment[1], circle, radius)) {
            return true
        }
    
        let x1 = lineSegment[0].x,
            y1 = lineSegment[0].y,
            x2 = lineSegment[1].x,
            y2 = lineSegment[1].y,
            cx = circle.x,
            cy = circle.y
    
        let dx = x2 - x1;
        let dy = y2 - y1;
        let lcx = cx - x1;
        let lcy = cy - y1;
        let dLen2 = dx * dx + dy * dy;
        let px = dx;
        let py = dy;
    
        if (dLen2 > 0) {
            let dp = (lcx * dx + lcy * dy) / dLen2;
            px *= dp;
            py *= dp;
        }
    
        if (!nearest) nearest = t;
        nearest.x = x1 + px;
        nearest.y = y1 + py;
    
        let pLen2 = px * px + py * py;
        return pointCircleCollide(nearest, circle, radius) && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
    }
    
    export function setMouseCursor(cursorSource: string = "default") {
        document.body.style.cursor = cursorSource || "default";
    }
    
    export function safeDivide(x: number, y: number): number {
        return isFinite(x / y) ? x / y : 0;
    }

    export function lerp(from: number, to: number, rate: number) {
        return from + (to - from) * rate;
    }
}