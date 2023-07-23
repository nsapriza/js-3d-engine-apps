let canvase     =   document.createElement("canvas");
canvase.width   =   window.innerWidth;
canvase.height  =   window.innerHeight;
document.body.appendChild(canvase);
let ctx         =   canvase.getContext("2d");


//--------------------------------------------------------------//
//                  funciones de uso general                    //
//--------------------------------------------------------------//



function drawPoint(x,y){
    ctx.fillRect(x-0.5, y-0.5, 0.5, 0.5);
    ctx.stroke();
}

function drawLine(a,b){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}

//--------------------------------------------------------------//
//                  funciones de sim 3d                         //
//--------------------------------------------------------------//

/* nada */

//--------------------------------------------------------------//
//                         objetos                              //
//--------------------------------------------------------------//

class Vector{
    constructor(name,x,y,z,displacement){
        this.name   = name
        this.x      = x
        this.y      = y
        this.z      = z
    }
    rotateXY(rad=Math.PI/4){
        let x = this.x * Math.cos(rad)   - this.y * Math.sin(rad)
        let y = this.x * Math.sin(rad)+ this.y * Math.cos(rad)
        let z = this.z
        this.update(x,y,z)
        //console.log("callXY")
    }
    rotateZY(rad=Math.PI/4){
        let x = this.x
        let y = this.y * Math.cos(rad)- this.z * Math.sin(rad)
        let z = this.y * Math.sin(rad) + this.z * Math.cos(rad)
        this.update(x,y,z)
        //console.log("callZY")
    }
    rotateZX(rad=Math.PI/4){
        //console.log([this.x,this.y,this.z])
        let x = this.x * Math.cos(rad) - this.z * Math.sin(rad)
        let y = this.y
        let z = this.x * Math.sin(rad)+ this.z * Math.cos(rad)
        this.update(x,y,z)
        //console.log("callXY")
        //console.log([this.x,this.y,this.z])
    }
    update(x,y,z){
        this.x = x
        this.y = y
        this.z = z
    }

}

class Line{
    constructor(name,p1,p2){
        this.name   = name
        this.vector1 = p1
        this.vector2 = p2
    }
    render(xOfset,yOfset,zOfset){
        let p1 = [this.vector1.x+xOfset,this.vector1.y+yOfset]
        let p2 = [this.vector2.x+xOfset,this.vector2.y+yOfset]
        drawLine(p1,p2)
    }
}

class Entity{
    constructor(pos){
        if (!Array.isArray(pos)){console.error("")}
        else if (pos.length != 3){console.error("")}

        this.x        = pos[0]
        this.y        = pos[1]
        this.z        = pos[2]
        this.vertices = []
        this.edges    = []
        this.faces    = []
        this.currentRotationXY = 0
        this.currentRotationZY = 0
        this.currentRotationZY = 0
        
    }
    addVertice(x,y,z){
        let name = "v-" + this.vertices.length
        let p = new Vector(name,x,y,z)
        this.vertices.push(p)
    }
    addEdge(p1Name,p2Name){
        if(!this.vertices.indexOf(p1Name) || !this.vertices.indexOf(p2Name)){
            console.error("vertice not found")
            return
        }
        let p1 
        let p2
        this.vertices.forEach((e)=>{
            if (e.name == p1Name){p1 = e}
            if (e.name == p2Name){p2 = e}
        })
        let name    = "e-"+this.edges.length
        let edge    = new Line(name,p1,p2) 
        this.edges.push(edge)
    }
    rotateXY(rad){
        this.vertices.forEach((e)=>{
            e.rotateXY(rad)
        })
        this.currentRotationXY += rad 
    }
    rotateZY(rad){
        this.vertices.forEach((e)=>{
            e.rotateZY(rad)
        })
        this.currentRotationZY += rad 
    }
    rotateZX(rad){
        this.vertices.forEach((e)=>{
            e.rotateZX(rad)
        })
        this.currentRotationZX += rad 
    }
    
    
    render(){
        this.edges.forEach((e,i)=>{
            e.render(this.x,this.y,this.z)})
    }
}

class Cube extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1,  1,  -1)//v-0
        this.addVertice(1,   1,  -1)//v-1
        this.addVertice(1,  -1,  -1)//v-2
        this.addVertice(-1, -1,  -1)//v-3
        this.addVertice(-1,  1,   1)//v-4
        this.addVertice(1,   1,   1)//v-5
        this.addVertice(1,  -1,   1)//v-6
        this.addVertice(-1, -1,   1)//v-7
        
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-0")//4
        this.addEdge("v-4","v-5")//5
        this.addEdge("v-5","v-6")//6
        this.addEdge("v-6","v-7")//7
        this.addEdge("v-7","v-4")//8
        this.addEdge("v-0","v-4")//9
        this.addEdge("v-1","v-5")//10
        this.addEdge("v-2","v-6")//11
        this.addEdge("v-3","v-7")//12
    }
}
class Piramid extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1,  1,  -1)//v-0
        this.addVertice(1,   1,  -1)//v-1
        this.addVertice(1,  -1,  -1)//v-2
        this.addVertice(-1, -1,  -1)//v-3
        this.addVertice(0,  0,   1)//v-4

        
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-0")//4
        this.addEdge("v-0","v-4")//5
        this.addEdge("v-1","v-4")//6
        this.addEdge("v-2","v-4")//7
        this.addEdge("v-3","v-4")//8
    }
}

class Hexagon extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1/2,  Math.sqrt(3)/2,  -1)//v-0
        this.addVertice(1/2,   Math.sqrt(3)/2,  -1)//v-1
        this.addVertice(1,  0,  -1)//v-2
        this.addVertice(1/2, -Math.sqrt(3)/2,  -1)//v-3
        this.addVertice(-1/2,  -Math.sqrt(3)/2,   -1)//v-4
        this.addVertice(-1, 0,  -1)//v-5
this.addVertice(-1 / 2, Math.sqrt(3) / 2, 1) //v-0
       this.addVertice(1 / 2, Math.sqrt(3) / 2, 1) //v-1
       this.addVertice(1, 0, 1) //v-2
       this.addVertice(1 / 2, -Math.sqrt(3) / 2, 1) //v-3
       this.addVertice(-1/2, -Math.sqrt(3)/2, 1) //v-4
       this.addVertice(-1, 0, 1) //v-5
        
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-4")//4
        this.addEdge("v-4","v-5")//5
        this.addEdge("v-6","v-7")//6
        this.addEdge("v-8","v-9")//7
        this.addEdge("v-10","v-11")//8
        this.addEdge("v-11", "v-6") //1
        this.addEdge("v-5", "v-0") //2
        this.addEdge("v-0", "v-6") //3
        this.addEdge("v-1", "v-7") //4
        this.addEdge("v-2", "v-8") //5
        this.addEdge("v-3", "v-9") //6
        this.addEdge("v-4", "v-10") //7
        this.addEdge("v-5", "v-11") //8
        this.addEdge("v-7", "v-8") //7
        this.addEdge("v-9", "v-10") //8
    }
}

//--------------------------------------------------------------//
//               instanciamiento de entidades                   //
//--------------------------------------------------------------//

let entities = []
let isTouching = false
let active = 0
let lastActive = 0


document.addEventListener("click", (e) => {
     //console.log(e.clientX,e.clientY)
     let en = new Cube([e.clientX, e.clientY, 0], [Math.random() * 100, Math.random() * 100, 100])
     let en2 = new Piramid([e.clientX + 100, e.clientY + 100, 0], [Math.random() * 100, Math.random() * 100, 100])
     let en3 = new Hexagon([e.clientX - 100, e.clientY - 100, 0], [Math.random() * 100, Math.random() * 100, 100])
     entities.push(en)
     entities.push(en2)
     entities.push(en3)
     active += 3
 })

//--------------------------------------------------------------//
//                         runtime                              //
//--------------------------------------------------------------//
ctx.clearRect(0,0,1000,1000)


i=1

setInterval(()=>{
    entities.forEach((e)=>{
        if(e instanceof Cube){
            if (e.currentRotationZY != -Math.PI/4){
                //e.rotateZY(-Math.PI/4)
            }
        }else{
            if (e.currentRotationZY != Math.PI/2){
                //e.rotateZY(Math.PI/4)
            }
        }        
    })
    if(i<100000000000000000){
        ctx.clearRect(0,0,10000,10000)
        entities.forEach((e)=>{
            e.rotateZX(0.01)
            e.rotateZY(0.01)
            e.rotateXY(0.01)
            let x = (e.x) * Math.cos(0.01) - (e.y) * Math.sin(0.01)
            let y = (e.x) * Math.sin(0.01) + (e.y) * Math.cos(0.01)
            e.x = x 
            e.y = y 
            //e.x+=10
            e.render()
            if(active > lastActive){
              console.clear()
              console.log("currently simulating "+active+" enteties")
              lastActive += 3
            }
        })
        i+=1
    }

},100)

