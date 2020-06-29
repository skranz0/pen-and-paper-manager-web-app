--Model and all Types
module Model exposing (..)

--elm Packages
import Bootstrap.Tab as Tab
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Modal as Modal
import Http
import Array
import Array.Extra as Array

type alias Model =
    { enemy : Array.Array Character -- The enemy displayed on the homepage
    , tmpEnemy : Character -- Will eventually be useless after refactor, I just have to get a better feel for let and in
    , tmpHero : Character
    , showString : String
    , myDrop1State : Dropdown.State
    , damage : Int
    , bonusDamage : Int
    , dice : String
    , tmpdice : String
    , dieFace : Int
    , maxFace : Int
    , tabState : Tab.State
    , characterList : List DungeonMap_Character
    , addCharacterIcon : AddCharacterIconState
    , dieFaces : List Int
    , showAttackModal : Modal.Visibility
    , showDeathAlert : Modal.Visibility
    , showCustomEnemy : Modal.Visibility
    , characterId : Int
    , enemyHero : String
    }

init : () -> (Model, Cmd Msg)
init _ =
    (
        { enemy = Array.empty
        , tmpEnemy = initEnemy
        , tmpHero = initHero
        , showString = ""
        , myDrop1State = Dropdown.initialState
        , damage = 0
        , bonusDamage = 0
        , dice = "1W6+0"
        , tmpdice = "1W6+0"
        , dieFace = 0
        , maxFace = 6
        , tabState = Tab.initialState
        , characterList = []
        , addCharacterIcon = DrawingInactive
        , dieFaces = []
        , showAttackModal = Modal.hidden 
        , showDeathAlert = Modal.hidden
        , showCustomEnemy = Modal.hidden
        , characterId = 0
        , enemyHero = ""
        }
    , Cmd.none
    )

initEnemy : Character
initEnemy =
    Enemy "none" 0 0 0 []
initHero : Character
initHero =
    Hero "none" 0


type Msg
    = LoadEnemy String -- call this with the name of the enemy to load its values into the enemy object
    | EnemyLoaded (Result Http.Error Character)
    | UpdateEnemy Int Character
    | UpdateTmp Character
    | AddEnemy Character
    | RemoveEnemy Int
    | CharacterDeath Int
    | MyDrop1Msg Dropdown.State
    | ChangeDamage String-- Will eventually be useless after refactor, I just have to get a better feel for let and in
    | DoNothing -- does nothing (yes, this IS necessary)
    | TabMsg Tab.State
    | AddCharacterIcon AddCharacterIconMsg
    | DiceAndSlice String
    | NewRandomList (List Int)
    | ChangeTmpDice String
    | CloseModal ModalType
    | ShowModal ModalType
    | ShowAttackModal Int
    | SwitchEnemyHero String

type ModalType
    = AttackModal
    | DeathAlert
    | CustomEnemy

type Character
    = Enemy String Int Int    Int (List String)
    --      name   LeP maxLeP RS  status
    | Hero String Int
    --     name   RS

type Status
    = Pain
    | Poison
    | Burn
    | Drunk

type AddCharacterIconState
    = DrawingInactive
    | DrawIcon CharacterIcon

type AddCharacterIconMsg
    = MouseDraw CharacterIcon
    | MouseClick CharacterIcon

type DungeonMap_Character
    = Player String String
    | Monster String String

type
    CharacterIcon
    = PlayerIcon String String
    | MonsterIcon String String

type alias MousePosition =
    { x : Float
    , y : Float
    }


