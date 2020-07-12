--Model and all Types
module Model exposing (..)

--elm Packages
import Bootstrap.Tab as Tab
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Modal as Modal
import Bootstrap.Form.Textarea as Textarea
import Http
import Array
import Array.Extra as Array
import File
import ColorPicker
import Color

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
    , modalTabState : Tab.State
    , characterList : List CharacterIcon
    , objectIconList : List CharacterIcon
    , addCharacterIcon : AddCharacterIconState
    , dieFaces : List Int
    , showAttackModal : Modal.Visibility
    , showDeathAlert : Modal.Visibility
    , showCustomEnemy : Modal.Visibility
    , showObjectIconModal : Modal.Visibility
    , characterId : Int
    , enemyHero : String
    , hover : Bool
    , previews : List String
    , iconText : String
    , colorPicker : ColorPicker.State
    , colour : Color.Color
    , radioCheckedID : Int
    , activeTooltip : String
    , highlightedTableRow : Int
    , mouseInIcon : Bool
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
        , modalTabState = Tab.initialState
        , characterList = []
        , objectIconList = []
        , addCharacterIcon = DrawingInactive
        , dieFaces = []
        , showAttackModal = Modal.hidden
        , showDeathAlert = Modal.hidden
        , showCustomEnemy = Modal.hidden
        , showObjectIconModal = Modal.hidden
        , characterId = 0
        , enemyHero = "Enemy"
        , hover = False
        , previews = []
        , iconText = ""
        , colorPicker = ColorPicker.empty
        , colour = Color.rgb 255 0 0
        , radioCheckedID = 0
        , activeTooltip = "Tooltip"
        , highlightedTableRow = 0
        , mouseInIcon = False
        }
    , Cmd.none
    )

initEnemy : Character
initEnemy =
    Enemy "none" 0 0 0 ""
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
    | ModalTabMsg Tab.State
    | AddCharacterIcon AddCharacterIconMsg
    | ClearCharacterList
    | DiceAndSlice String
    | NewRandomList (List Int)
    | ChangeTmpDice String
    | CloseModal ModalType
    | ShowModal ModalType
    | ShowAttackModal Int
    | SwitchEnemyHero String
    | Pick
    | DragEnter
    | DragLeave
    | GotFiles File.File (List File.File)
    | GotPreviews (List String)
    | ChangeIconText String
    | ChangeIcon Int
    | ColorPickerMsg ColorPicker.Msg
    | ToolTipMsg String
    | HighlightTableRow Int String
    | DeleteIcon String Int

type ModalType
    = AttackModal
    | DeathAlert
    | CustomEnemy
    | ObjectIconModal

type Character
    = Enemy String Int Int    Int String
    --      name   LeP maxLeP RS  pain
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

type CharacterIcon
    = PlayerIcon Int String String String
    | MonsterIcon Int String String String
    --            ID  x-coord y-coord name
    | ObjectIcon Int     String  String  String (Maybe Color.Color) Int
    --           type-ID x-coord y-coord Text custom-color          ident
    -- ID in ObjectIcon type is not an identifier for a concrete ObjectIcon, its an identifier for the used png

type alias MousePosition =
    { x : Float
    , y : Float
    }
