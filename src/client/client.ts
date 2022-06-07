import { BoxGeometry, Mapping, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, Texture, Vector2, WebGLRenderer } from "three";
import { GameState } from "./game";
import { LobbyGUI } from "./GUIs/Lobby";
import { Utils } from "./util";

var app: App;

$(function() {
    app = new App(window.innerWidth, window.innerHeight);
    app.animate();
});

export class App {
    readonly renderer: WebGLRenderer;
    readonly rendererCanvas: HTMLCanvasElement;
    readonly camera: PerspectiveCamera;
    readonly scene: Scene;
    
    readonly uiCanvas: HTMLCanvasElement;
    readonly uiCamera: OrthographicCamera;
    readonly uiScene: Scene;
    readonly ui: CanvasRenderingContext2D;
    readonly uiMaterial: MeshBasicMaterial;
    readonly uiGeometry: PlaneGeometry;
    readonly uiPlane: Mesh;
    public uiTexture: Texture;

    public mousePos: Vector2 = new Vector2(0, 0);
    public deltaMouseDown: boolean = false;
    public mouseDown: boolean = false;
    public mouseClick: boolean = false;
    public keysDown: string[] = [];
    
    public width!: number;
    public height!: number;

    public appState: GameState = GameState.LOBBY;
    public fov: number = 70;
    
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.renderer = new WebGLRenderer();
        this.rendererCanvas = this.renderer.domElement;
        this.camera = new PerspectiveCamera();
        this.scene = new Scene();
        
        this.uiCamera = new OrthographicCamera(-this.width / 2, this.width / 2, this.height/2, -this.height / 2, 0, 1);
        this.uiCanvas = document.createElement("canvas");
        this.uiScene = new Scene();
        this.ui = this.uiCanvas.getContext("2d")!;
        this.uiTexture = new Texture(this.uiCanvas);
        this.uiMaterial = new MeshBasicMaterial( { map: this.uiTexture, transparent: true });
        this.uiGeometry = new PlaneGeometry(this.width, this.height);
        this.uiPlane = new Mesh(this.uiGeometry, this.uiMaterial);
        this.uiScene.add(this.uiPlane);

        this.renderer.autoClear = false;

        this.camera.near = 0.1;
        this.camera.far = 1000;
        
        this.resize(width, height);

        document.body.appendChild(this.rendererCanvas);

        this.setup();
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public setup(): void {
        $(window).on("resize", function() {
            app.resize(window.innerWidth, window.innerHeight);
        });

        $(window).on("mousemove", function(e) {
            app.mousePos.x = e.clientX;
            app.mousePos.y = e.clientY;
        });
        
        $(window).on("mousedown", function() {
            app.mouseDown = true;
        });
        
        $(window).on("mouseup", function() {
            app.mouseDown = false;
        });
        
        $(window).on("keydown", function(e) {
            !app.keysDown.includes(e.key) ? app.keysDown.push(e.key) : "";
        });
        
        $(window).on("keyup", function(e) {
            app.keysDown.includes(e.key) ? app.keysDown.splice(app.keysDown.indexOf(e.key), 1) : "";
        });

        $(window).on("resize", function(e) {
            app.uiTexture.dispose();
            app.uiTexture = new Texture(app.uiCanvas);
        });
    }

    public animate(): void {
        window.requestAnimationFrame(this.animate.bind(this));

        this.render();
    }

    public onGUI(): void {
        switch(this.appState) {
            case GameState.LOBBY:
                LobbyGUI.onGUI(this);
                break;
        }
    }
    
    public render(): void {
        Utils.setMouseCursor("default");

        this.mouseClick = !this.deltaMouseDown && this.mouseDown;
        
        this.ui.clearRect(0, 0, this.width, this.height);
        this.uiCanvas.width = this.width;
        this.uiCanvas.height = this.height;
        this.uiCamera.left = -this.width / 2;
        this.uiCamera.right = this.width / 2;
        this.uiCamera.top = this.height / 2;
        this.uiCamera.bottom = -this.height / 2;
        this.uiCamera.updateProjectionMatrix();
        this.onGUI();
        this.uiTexture.needsUpdate = true;

        this.renderer.setSize(this.width, this.height);
        this.camera.fov = this.fov;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.uiScene, this.uiCamera);
    }

    public get debug() {
        return this.keysDown.includes("`");
    }
}