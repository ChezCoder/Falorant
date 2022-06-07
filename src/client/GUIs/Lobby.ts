import { Vector2 } from "three";
import { App } from "../client";
import { COLOR_SCHEME, GameOption, GAME_OPTIONS } from "../game";
import { Utils } from "../util";

export namespace LobbyGUI {
    export let gameOption: GameOption = GameOption.DEATHMATCH;
    
    let gameOptionIndicatorX: number = -1;
    let gameOptionPadding: {[gameOption: string]: number} = {};
    let buttonPadding: number = 20;
    let noticeText: string = "";
    let noticeOpacity: number = 0;

    function logo(app: App) {
        const y = app.height * 0.2;
        const y2 = app.height * 0.25;

        const logoText = "Falorant";
        const logoFont = "100px Arial";
        
        app.ui.beginPath();
        app.ui.fillStyle = "white";
        app.ui.font = logoFont;
        app.ui.fillText(logoText, app.width / 2 - Utils.measureTextWidth(app.ui, logoText, logoFont) / 2, y);
        app.ui.fill();
        app.ui.closePath();
    
        const logoSubText = "Beta v0.1";
        const logoSubFont = "30px Arial";

        app.ui.beginPath();
        app.ui.fillStyle = "white";
        app.ui.font = logoSubFont;
        app.ui.fillText(logoSubText, app.width / 2 - Utils.measureTextWidth(app.ui, logoSubText, logoSubFont) / 2, y2);
        app.ui.fill();
        app.ui.closePath();
    }

    function joinButton(app: App) {
        const y = app.height * 0.6;

        const buttonText = "Join server";
        const buttonFont = "40px Arial";
        const buttonBG = "white";
        const bw = Utils.measureTextWidth(app.ui, buttonText, buttonFont);
        const bh = Utils.measureTextHeight(app.ui, buttonText, buttonFont);

        if (Utils.isPointInRectangle(app.mousePos, new Vector2(app.width / 2 - bw / 2 - buttonPadding, y - bh - buttonPadding), bw + (buttonPadding * 2), bh + (buttonPadding * 2))) {
            buttonPadding = Utils.lerp(buttonPadding, 25, 0.3);
            Utils.setMouseCursor("pointer");
            if (app.mouseClick) {
                // TODO connection
            }
        } else {
            buttonPadding = Utils.lerp(buttonPadding, 20, 0.3);
        }
        
        app.ui.beginPath();
        app.ui.fillStyle = buttonBG;
        app.ui.fillRect(app.width / 2 - bw / 2 - buttonPadding, y - bh - buttonPadding, bw + (buttonPadding * 2), bh + (buttonPadding * 2));
        app.ui.closePath();
    
        app.ui.beginPath();
        app.ui.font = buttonFont;
        app.ui.fillStyle = "black";
        app.ui.fillText(buttonText, app.width / 2 - bw / 2, y);
        app.ui.fill();
        app.ui.closePath();
    }

    function gameSelectBar(app: App) {
        const y = app.height * 0.4;

        const sectionWidth = 90;
        const sectionHeight = 20;
        const sectionFont = "20px Arial";
        const sectionBackground = "white";
        const sectionColor = "black";
        const sectionDefaultPadding = 10;

        const spacing = ((window as any).gameSelectBarSpacing || 30);

        const barBackground = COLOR_SCHEME.GRAY;
        const barPadding = ((window as any).gameSelectBarPadding || 20);

        const barWidth = (GAME_OPTIONS.length * sectionWidth) + ((GAME_OPTIONS.length - 1) * spacing);
        const barStart = app.width / 2 - barWidth / 2;

        const selectionHeight = 5;
        const selectionColor = COLOR_SCHEME.LIGHT_RED;

        app.ui.beginPath();
        app.ui.fillStyle = barBackground;
        app.ui.fillRect(barStart - barPadding, y - barPadding, barWidth + barPadding * 2, sectionHeight + barPadding * 2);
        app.ui.fill();
        app.ui.closePath();

        for(let i = 0;i < GAME_OPTIONS.length;i++) {
            const sectionStart = barStart + (i * (sectionWidth + spacing));
            const option = GAME_OPTIONS[i];
            let sectionPadding = gameOptionPadding[option] || sectionDefaultPadding;
            
            if (gameOption != option) {
                if (Utils.isPointInRectangle(app.mousePos, new Vector2(sectionStart - sectionPadding, y - sectionPadding), sectionWidth + sectionPadding * 2, sectionHeight + sectionPadding * 2)) {
                    gameOptionPadding[option] = Utils.lerp(sectionPadding, 13, 0.1);
                    Utils.setMouseCursor("pointer");
                    if (app.mouseClick) {
                        gameOption = option;
                    }
                } else {
                    gameOptionPadding[option] = Utils.lerp(sectionPadding, 10, 0.1);    
                }
            } else {
                gameOptionPadding[option] = Utils.lerp(sectionPadding, 10, 0.3);
            }

            app.ui.beginPath();
            app.ui.fillStyle = sectionBackground;
            app.ui.fillRect(sectionStart - sectionPadding, y - sectionPadding, sectionWidth + sectionPadding * 2, sectionHeight + sectionPadding * 2);
            app.ui.fill();
            app.ui.closePath();

            const sectionCenter = sectionStart + sectionWidth / 2;
            const sectionTW = Utils.measureTextWidth(app.ui, option, sectionFont);
            const sectionTH = Utils.measureTextHeight(app.ui, option, sectionFont);

            app.ui.beginPath();
            app.ui.fillStyle = sectionColor;
            app.ui.font = sectionFont;
            if (sectionTW > sectionWidth) {
                app.ui.fillText(option.replace("_", " "), sectionStart, y + sectionHeight / 2 + sectionTH / 2, sectionWidth);
            } else {
                app.ui.fillText(option.replace("_", " "), sectionCenter - sectionTW / 2, y + sectionHeight / 2 + sectionTH / 2, sectionWidth);
            }
            app.ui.closePath();

            if (gameOption == option) {
                if (gameOptionIndicatorX == -1) {
                    gameOptionIndicatorX = sectionStart;
                } else {
                    gameOptionIndicatorX = Utils.lerp(gameOptionIndicatorX, sectionStart, 0.1);
                }
            }
            
            app.ui.beginPath();
            app.ui.fillStyle = selectionColor;
            app.ui.fillRect(gameOptionIndicatorX - sectionPadding, y + sectionHeight - selectionHeight + sectionDefaultPadding, sectionWidth + sectionPadding * 2, selectionHeight);
            app.ui.fill();
            app.ui.closePath();

            if (app.debug) {
                app.ui.beginPath();
                app.ui.fillStyle = "red";
                app.ui.fillRect(sectionCenter - sectionTW / 2, y - (i * 5), sectionTW, 5);
                app.ui.fill();
                app.ui.closePath();
    
                app.ui.beginPath();
                app.ui.strokeStyle = "red";
                app.ui.lineWidth = 2;
                app.ui.moveTo(sectionCenter - 1, y);
                app.ui.lineTo(sectionCenter - 1, y + sectionHeight);
                app.ui.stroke();
                app.ui.closePath();
            }
        }

        if (app.debug) {
            app.ui.beginPath();
            app.ui.fillStyle = "red";
            app.ui.fillRect(barStart, y, 10, 10);
            app.ui.fill();
            app.ui.closePath();
    
            app.ui.beginPath();
            app.ui.strokeStyle = "red";
            app.ui.lineWidth = 2;
            app.ui.moveTo(barStart + barWidth / 2 - 1, y);
            app.ui.lineTo(barStart + barWidth / 2 - 1, y + sectionHeight);
            app.ui.stroke();
            app.ui.closePath();
        }
    }

    function debugVision(app: App) {
        const text = "DEBUG VISION";
        const font = "15px monospace";
        const color = "#00ff00";
        const width = Utils.measureTextWidth(app.ui, text, font);
        const height = Utils.measureTextHeight(app.ui, text, font);
        const background = "black";
        const margin = 10;
        const padding = 10;
        
        app.ui.beginPath();
        app.ui.fillStyle = background;
        app.ui.fillRect(margin, margin, width, height);
        app.ui.fill();
        app.ui.closePath();

        app.ui.beginPath();
        app.ui.fillStyle = color;
        app.ui.font = font;
        app.ui.fillText(text, margin, margin + height);
        app.ui.fill();
        app.ui.closePath();

        app.ui.beginPath();
        app.ui.strokeStyle = "red";
        app.ui.lineWidth = 2;
        app.ui.moveTo(app.width / 2 - 1, 0);
        app.ui.lineTo(app.width / 2 - 1, app.height);
        app.ui.stroke();
        app.ui.closePath();

        app.ui.beginPath();
        app.ui.strokeStyle = "red";
        app.ui.lineWidth = 2;
        app.ui.moveTo(0, app.height / 2 - 1);
        app.ui.lineTo(app.width, app.height / 2 - 1);
        app.ui.stroke();
        app.ui.closePath();
    }

    export function guiNotice(app: App) {
        const y = app.height * 0.6;

        const noticeColor = "white";
        const noticeFont = "20px Arial";

        const width = Utils.measureTextWidth(app.ui, noticeText, noticeFont);

        // TODO finish opacity with globalAlpha
        app.ui.save();
        app.ui.beginPath();
        app.ui.fillStyle = noticeColor;
        app.ui.globalAlpha = noticeOpacity;
        app.ui.fillText(noticeText, app.width / 2 - width / 2, y);
        app.ui.fill();
        app.ui.closePath();
        app.ui.restore();
    }

    export function onGUI(app: App) {
        logo(app);
        joinButton(app);
        gameSelectBar(app);
        guiNotice(app);

        if (app.debug) {
            debugVision(app);
        }
    }
}