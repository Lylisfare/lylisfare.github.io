//坐标
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

//圆形
class Circ {
    constructor(vec2, radius = 0) {
        this.pos = vec2;
        this.radius = radius;
    }
    contains(vec) {
        let dx = vec.x - this.pos.x;
        let dy = vec.y - this.pos.y;
        let r2 = this.radius ** 2;
        let d2 = dx ** 2 + dy ** 2;

        return (d2 < r2);
    }
    collision(circ) {
        let x = circ.pos.x - this.pos.x;
        let y = circ.pos.y - this.pos.y;
        let r2 = (circ.radius + this.radius) ** 2;
        let l2 = x ** 2 + y ** 2;

        return (l2 < r2);
    }
    render(ctx, color = "#00ff00") {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
        ctx.moveTo(this.pos.x + this.radius, this.pos.y);
        ctx.closePath();
        ctx.stroke();
    }
}

//实体
class Entity {
    constructor(id) {
        this.id = id;
    }
}

class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }
    contains(vec) {
        if (!this.w || !this.h) return false;

        const { x, y } = vec;

        if (x >= this.x && x <= this.x + this.w) {
            if (y >= this.y && y <= this.y + this.h) return true;
        }
        return false;
    }
    collision(circ) {

        if (this.contains(circ.pos)) return true;

        let poly = [
            { x: this.x, y: this.y },
            { x: this.x + this.w, y: this.y },
            { x: this.x + this.w, y: this.y + this.h },
            { x: this.x, y: this.y + this.h }
        ];

        for (let i = 0; i < 4; i++) {
            if (circ.contains(poly[i])) return true;
        }

        let r2 = circ.radius ** 2;

        for (let i = 0, j = 3; i < 4; j = i++) {
            let p = rayCast(this, circ.pos, poly[i], poly[j]);
            if(p){
                if(circ.contains(p)) return true;
            }
        }

        return false;

    }
}

function createBullet(x, y, radius, vx, vy) {
    let pos = new Vec2(x, y);
    let vec = new Vec2(vx, vy);
    let shape = new Circ(pos, radius);
    let hit = false;

    function update() {
        pos.x += vec.x;
        pos.y += vec.y;
    }

    function render(ctx, color) {
        shape.render(ctx, color);
    }

    return { pos, vec, shape, update, render, hit }
}

//创建实体
function createEntity(id, x, y, radius, vx, vy) {
    let entity = new Entity(id);
    let pos = new Vec2(x, y);
    let vec = new Vec2(vx, vy);
    let shape = new Circ(pos, radius);
    let weapon = [];
    let hurt = false;

    function updateWeapon(area) {


        for (let i = 0; i < weapon.length; i++) {
            let bullet = weapon[i];
            bullet.update();
        }

        for (let i = 0; i < weapon.length; i++) {
            let bullet = weapon[i];
            if (!area.contains(bullet.pos) || bullet.hit) {
                weapon.splice(i, 1);
            }
        }
    }

    function renderWeapon(ctx, color) {
        for (let i = 0; i < weapon.length; i++) {
            let bullet = weapon[i];
            bullet.render(ctx, color);
        }
    }

    function shot() {
        let bullet = createBullet(pos.x, pos.y - shape.radius - 5, 5, 0, -2);
        weapon.push(bullet);
    }

    function update(area) {
        pos.x += vec.x;
        pos.y += vec.y;

        updateWeapon(area);
    }

    function render(ctx, color) {
        shape.render(ctx, color);

        renderWeapon(ctx, color);
    }

    function collision(entity) {
        for (let i = 0; i < weapon.length; i++) {
            let bullet = weapon[i];

            if (bullet.shape.collision(entity.shape)) {
                bullet.hit = true;
                entity.hurt = true;

                break;
            }
        }
    }

    return { entity, pos, shape, vec, update, render, shot, weapon, hurt, collision };
}

function randomVec2(x, y, w, h) {
    let rx = randomNum(x, x + w);
    let ry = randomNum(y, y + h);
    return [rx, ry]
}

function randomNum(min = 0, max = 1) {
    let rand = Math.random();
    return min + rand * max;
}


function rayCast(a = Vec2, b = Vec2, c = Vec2, d = Vec2) {
    const x1 = c.x, y1 = c.y;
    const x2 = d.x, y2 = d.y;
    const x3 = a.x, y3 = a.y;
    const x4 = b.x, y4 = b.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (!den) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    return (t > 0 && t < 1 && u > 0) ? { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) } : false;


}