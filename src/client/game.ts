export enum GameState {
    LOBBY,
    LOADING,
    BUYING,
    AGENT_SELECT,
    IN_GAME,
}

export enum GameOption {
    UNRATED = "UNRATED",
    SPIKE_RUSH = "SPIKE_RUSH",
    REPLICATION = "REPLICATION",
    DEATHMATCH = "DEATHMATCH",
    ESCALATION = "ESCALATION"
}

export enum COLOR_SCHEME {
    LIGHT_RED = "#dc3d4b",
    LIGHTER_RED = "#fa4454",
    DARK_GREEN = "#042e27",
    LIGHT_BEIGE = "#b38c8f",
    BEIGE = "#b78460",
    BLUE = "#364966",
    GRAY = "#202020"
}

export const GAME_OPTIONS = [GameOption.UNRATED, GameOption.SPIKE_RUSH, GameOption.DEATHMATCH, GameOption.REPLICATION, GameOption.ESCALATION];