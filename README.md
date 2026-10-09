## Folders structure
- core: models, interface, service. All code is agnostic and can be retired and used in other application
- game: data and scene / game instanciation
- application: game adapters

## Architecture

### Class Diagram
The core layer follows a hegagonale architecture with separation between models, utilities, and scene management.

```mermaid
graph TD
    classDef base fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef interface fill:#e8f5ff,stroke:#3399ff,stroke-width:2px
    classDef abstract fill:#ffe0e0,stroke:#ff6666,stroke-width:2px

    subgraph Core["Core Layer"]
        Actor["Actor<br/>(extends EventEmitter)"]
        MoveableActor["MoveableActor<br/>(extends Actor)"]
        Asset["Asset<br/>(abstract)"]
        ImageAsset["ImageAsset<br/>(extends Asset)"]
        MeshAsset["MeshAsset<br/>(extends Asset)"]
        Input["Input<br/>(abstract)"]
        MoveInput["MoveInput<br/>(extends Input)"]
    end

    subgraph Utils["Utility Layer"]
        EventEmitter["EventEmitter"]
        EventDecorator["EventDecorator"]
    end

    subgraph SceneLayer["Scene Layer"]
        Scene["Scene<br/>(extends EventEmitter)"]
    end

    IRenderable["IRenderable"]
    IActorProperties["IActorProperties"]
    IAssetProperties["IAssetProperties"]
    IInputProperties["IInputProperties"]

    Actor -->|implements| IRenderable
    Actor -->|implements| IActorProperties
    Actor -->|extends| EventEmitter

    MoveableActor -->|extends| Actor
    MoveableActor -->|uses| Input

    Asset -->|implements| IAssetProperties
    ImageAsset -->|extends| Asset
    MeshAsset -->|extends| Asset

    Input -->|implements| IInputProperties
    MoveInput -->|extends| Input

    Scene -->|extends| EventEmitter
    Scene -->|uses| Actor

    class Actor,MoveableActor base
    class Asset,ImageAsset,MeshAsset interface
    class Input,MoveInput abstract
    class Scene interface
```

### Asset Hierarchy
```mermaid

graph TD
    subgraph AssetHierarchy["Hiérarchie d'assets"]
        direction BT

        IAsset["IAssetConstructor<br/>Interface"]
        Asset["Asset<br/>(classe abstraite)"]
        ImageAsset["ImageAsset<br/>(hérite d'Asset)"]
        MeshAsset["MeshAsset<br/>(hérite d'Asset)"]

        AssetProperties["IAssetProperties<br/>Interface"]
        AssetLoad["load(): Promise&lt;void&gt;"]
        AssetClone["clone(): Asset"]

        IAsset -->|implémente| Asset
        Asset -->|implémente| AssetProperties
        Asset -->|possède| AssetLoad
        Asset -->|possède| AssetClone
        ImageAsset -->|hérite| Asset
        MeshAsset -->|hérite| Asset
    end

    classDef abstract fill:#ffe0e0,stroke:#ff6666,stroke-width:2px
    classDef interface fill:#e8f5ff,stroke:#3399ff,stroke-width:2px
    classDef assetClass fill:#f9f9f9,stroke:#333,stroke-width:1px

    class Asset abstract
    class IAsset,AssetProperties interface
    class ImageAsset,MeshAsset,AssetLoad,AssetClone assetClass
```

### Diagrammes de flux

#### Flux de traitement des entrées
```mermaid

graph TD
    subgraph InputFlow["Flux de traitement des entrées"]
        direction TB

        userInput["Entrée utilisateur<br/>(ex. : pression de touche)"]
        registerInput["registerInput()<br/>Déplace l'entrée vers l'acteur"]
        computeInput["compute(data)<br/>Définit l'état sur occupé et itère les emplacements"]
        executeInput["execute()<br/>Met à jour les positions de l'acteur via l'itérateur"]
        sceneUpdate["Scene.update()<br/>Exécute les entrées des acteurs en cours de mise à jour"]
        render["Rendu d'une frame"]

        userInput --> registerInput
        registerInput --> computeInput
        computeInput --> executeInput
        executeInput --> sceneUpdate
        sceneUpdate --> render
    end

    classDef flow fill:#e8f5e9,stroke:#333,stroke-width:2px
    class userInput,registerInput,computeInput,executeInput,sceneUpdate,render flow
```

#### Flux de mise à jour de la scène
```mermaid

graph TD
    subgraph SceneFlow["Flux de mise à jour de la scène"]
        direction TB

        notify["notifyInputs(payload)<br/>Vérifie si l'acteur est un MoveableActor"]
        isUpdating["isUpdating()<br/>Vérifie les états d'entrée de l'acteur"]
        execute["executeInputs()<br/>Exécute les entrées occupées"]
        render["Rendu d'une frame"]

        notify --> isUpdating
        isUpdating --> execute
        execute --> render
    end

    classDef flow fill:#e8f5e9,stroke:#333,stroke-width:2px
    class notify,isUpdating,execute,render flow
```