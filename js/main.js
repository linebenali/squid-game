//1/creation de la scene et la camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer(); //renderer nous permet d'afficher le travail sur un élément HTML Canvas. Par défaut, il utilise WebGL.
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );//affichage de la scene 



//2/
camera.position.z = 5 //position de la camera pour agrandir ou non l'objet de la scene


//3/ texture pour arriere plan 
const backgTexture = new THREE.TextureLoader();
scene.background = backgTexture.load( './texture/blood.jpg' );


//4/ load a GLTF resource to run in browser
const loader = new THREE.GLTFLoader() 


//5/ 
//lumiere
//add the light to see the model
const light = new THREE.AmbientLight( 0xffffff , 0.5);
scene.add( light );//ajouter light 


//6/
//bech ki tbadal taille ta3 l onglet , e scene tetbadal m3aha 
window.addEventListener('resize',onwindowResize,'false')
function  onwindowResize(){
    camera.aspect=window.innerWidth/ window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

//7/
//les variables globales 
const start_position=3 //position de depart 
const end_position=-start_position //position d'arrée
const text = document.querySelector(".text")
const TIMIT_LIMIT=10
let  gameStat ="loading"
let isLookingBackward=true//variable look en arriere 


//8/
//creer un cube pour creer le runnaway
function createCube(size,positionX,rotY,color=0xfbc851){
const geometry = new THREE.BoxGeometry(size.w,size.h,size.d); 
const material = new THREE.MeshBasicMaterial( { color:color } );
const cube = new THREE.Mesh( geometry, material );
cube.position.x=positionX;
cube.roty=rotY;
scene.add( cube );
return cube ; 
}


//9/ 
//appeler le cube créé pour en creer plusieurs
function createTrack(){
//Creating runway orangé
    createCube({w :0.2,h:1.5,d:1},start_position,-.35);
    createCube({w :0.2,h:1.5,d:1},end_position,.35);
    createCube({w:start_position*2 +.2,h:1.5,d:1},0,0,0xe5a716).position.z=-1;
}
createTrack(); 


//9//
//l'objet 3D  
class Doll {
    constructor(){
        loader.load( './model/scene.gltf',( gltf ) => {
            scene.add( gltf.scene );
            gltf.scene.scale.set(0.05,0.04,0.05);
            gltf.scene.position.set(0,-1,0);
            this.doll=gltf.scene;//appel de l'objet
        })
        } 
        lookBackward(){
            gsap.to(this.doll.rotation,{y :-3.15,duration:0.45});
            setTimeout(()=>isLookingBackward=true,150)
        }
        lookForward(){
            gsap.to(this.doll.rotation,{y :0,duration:0.45});
            setTimeout(()=>isLookingBackward=false,450)
        }
        async start(){//start running
        this.lookBackward()
        await delay((Math.random()*1000 )+1000)
        this.lookForward()
        await delay((Math.random()*750)+750)
        this.start()
        }
    }
    let doll = new Doll ()

 //Player   
class Player{   
    constructor(){
        const geometry = new THREE.SphereGeometry( .3, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xb7c3f3 } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z=1
        sphere.position.x=start_position
        scene.add( sphere )
        this.player=sphere;
        this.playerInfo={
            positionX:start_position,
            velocity:0
        }
    }
            //movement of the player 
            run(){  
                this.playerInfo.velocity=.03
            }
            //to stop the player
            stop(){ 
                gsap.to(this.playerInfo,{velocity:0, duration:.1})
            }
            //check if the player won or lost
            check(){ 
            if (this.playerInfo.velocity>0 && !isLookingBackward){
                alert("you lost!")
                text.innerText="You lost!"
                gameStat="over"
                bgMusic.loop = false
                loseMusic.play()
                    }
            if (this.playerInfo.positionX < end_position + .4){ //si il depasse le runnaway
            alert("you won !")
            text.innerText="You won !"
            gameStat="over"
            bgMusic.loop = false
            winMusic.play()

            }}
            update(){
                this.check()
                this.playerInfo.positionX-=this.playerInfo.velocity
                this.player.position.x=this.playerInfo.positionX
            }
}
const player = new Player()


async function init(){
    await delay(500)
    text.innerText="Starting in 3"
    await delay(500)
    text.innerText="Starting in 2"
    await delay(500)
    text.innerText="Starting in 1"
    await delay(500)
    text.innerText="Goo!!!!!"
    bgMusic.play()
    startGame()
}
init()


//start the game
function  startGame(){
    gameStat = "started"
    let progressBar=createCube({w:5,h:.1,d:1},0)
    progressBar.position.y=3.35
    gsap.to(progressBar.scale,{x:0,duration:TIMIT_LIMIT, ease:"none"})
    doll.start()

    //idha l wa9t wfa y9olk time over
    setTimeout(()=> {
        if (gameStat!="over"){
            text.innerText="TIME OVER!"//lwa9t ili bach nibda bih il lo3ba 
            gameStat="over"
        }
     TIMIT_LIMIT},10000);
     }
    function delay(ms){//
    return new Promise(resolve=>setTimeout(resolve,ms));}

//animation de la camera
function animate() {
    if (gameStat=="over")return
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
    player.update()
}
animate();


//mouvement du player en tappant sur le clavier
window.addEventListener('keydown',(e)=>{
    if(gameStat != "started") return
    if(e.key =="ArrowUp"){
        player.run()
    }
}) 

window.addEventListener ('keyup',(e)=>{
    if(e.key =="ArrowUp"){
        player.stop()
    }
})

//musics
const bgMusic = new Audio('./music/bg.mp3')
const winMusic = new Audio('./music/win.mp3')
const loseMusic = new Audio('./music/lose.mp3')
bgMusic.loop = true