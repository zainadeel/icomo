# Icon Aliases — Review Draft

**Format:** `IconName` → `alias1`, `alias2`, `alias3`

Aliases are semantic synonyms to help agents and humans find icons by intent. Lucide-style: lowercase, hyphenated. Add or remove freely — these are a starting point.

Once approved, each line becomes a sidecar `src/icons/<IconName>.json` with:

```json
{ "aliases": ["alias1", "alias2", "alias3"] }
```

---

## ⚠️ Needs your eyeballs (ambiguous / domain-specific)

Please confirm these — I guessed from name alone:

- **`PicmanFilled`** — guessed `picman`, `google-street-view`, `street-view`
- **`LED`** — `light`, `indicator`, `signal`
- **`Omnicam`** — `360-camera`, `side-camera`, `all-around-cam`
- **`PunchCard`** — `timesheet`, `attendance`, `punch-clock`
- **`KeyA` / `KeyB`**, **`CameraA` / `CameraB`**, **`MapA` / `MapB`**, **`WorkflowA` / `WorkflowB`** — Visual variants only
- **`MapBBetaBottom` / `MapBBetaTop`** — what does "Beta Bottom/Top" mean? Where the beta modifier is in the icon
- **`DocumentInverted`** — It's the shape inverted but its mainly used for 'Notes' or 'Sticky note' like design uses
- **`LetterB` / `LetterC` / `LetterI`** — are these letter labels for something specific generic letters
- **`SpeedometerLeft` / `SpeedometerRight`** — directional slow/fast, or just visual variants? fast/slow yes.
- **`GuageTemperature`** — filename has typo (`Guage` → `Gauge`). Worth renaming? yes. you can fix name in svg and rest i'll fix in figma
- **`ClockSixteenHour`** — assumed HOS (hours-of-service) for fleet compliance. Right domain? yes
- **`NumberTen`** — why specifically 10? Is there a set of number icons planned? no. It's a generic icon for a page element where this depicts a number field you can add

---

## Full list (377 icons)

### A

- `AI` → `artificial-intelligence`, `smart`, `ml`
- `AIChip` → `ai-processor`, `neural-chip`, `smart-chip`
- `AIDashcamPlus` → `smart-camera`, `ai-camera`, `intelligent-dashcam`
- `AINew` → `new-ai`, `ai-badge`, `ai-feature`
- `AISparkle` → `ai-magic`, `ai-shine`, `smart-sparkle`
- `AUX` → `auxiliary`, `extra`, `secondary`
- `AUXFilled` → `auxiliary-filled`, `extra-solid`, `secondary-selected`
- `AndroidFilled` → `android`, `robot`, `google-os`
- `ArrowDown` → `down`, `south`, `descend`
- `ArrowLeft` → `left`, `west`, `back`
- `ArrowPath` → `refresh`, `cycle`, `loop`
- `ArrowRight` → `right`, `east`, `forward`
- `ArrowUp` → `up`, `north`, `ascend`
- `ArrowsDiagonal` → `resize`, `expand`, `maximize`
- `ArrowsDiff` → `swap`, `exchange`, `compare`
- `ArrowsDiffDisabled` → `swap-off`, `no-exchange`, `compare-disabled`
- `ArrowsVertical` → `sort`, `reorder`, `up-down`
- `AssetTracker` → `gps-tracker`, `asset-device`, `tracker`
- `AtSign` → `at`, `email-symbol`, `mention`
- `Avatar` → `profile`, `user-photo`, `portrait`

### B

- `BackslashBrackets` → `regex`, `code-brackets`, `escape`
- `BatteryCharging` → `charging`, `power`, `battery-plug`
- `BatteryEmpty` → `no-power`, `depleted`, `empty`
- `BatteryFull` → `full-power`, `charged`, `100-percent`
- `BatteryHalf` → `half-power`, `medium-battery`, `50-percent`
- `BatteryLow` → `low-power`, `weak-battery`, `battery-warning`
- `Beaker` → `lab`, `science`, `experiment`
- `Bell` → `notification`, `alert`, `alarm`
- `BellCircle` → `alert-circle`, `notification-round`, `circle-bell`
- `BellExclamation` → `alert-warning`, `urgent-notification`, `important`
- `BellRinging` → `active-alert`, `ringing`, `alarm-on`
- `BellWifi` → `wireless-alert`, `connected-notification`, `network-bell`
- `BlackWhite` → `contrast`, `monochrome`, `grayscale`
- `BlankUI` → `empty-state`, `placeholder`, `no-content`
- `Bluetooth` → `wireless`, `bt`, `pairing`
- `Bookmark` → `save`, `favorite`, `ribbon`
- `Box` → `package`, `container`, `carton`
- `Braces` → `code`, `curly-brackets`, `json`
- `Bug` → `debug`, `defect`, `error`
- `BuildingFacility` → `warehouse`, `plant`, `depot`
- `BuildingHome` → `house`, `home`, `residence`
- `BuildingOffice` → `office`, `workplace`, `corporate`
- `BuildingPublic` → `government`, `public-building`, `civic`
- `BuildingShop` → `store`, `retail`, `shop`
- `Bulb` → `idea`, `light`, `tip`

### C

- `Calculator` → `math`, `compute`, `calc`
- `Calendar` → `date`, `schedule`, `month`
- `CalendarClock` → `scheduled`, `deadline`, `reminder`
- `CameraA` → `camera`, `photo`, `lens`
- `CameraB` → `camera-alt`, `photo-alt`, `dashcam-variant`
- `Card` → `id-card`, `credit-card`, `badge`
- `CardPerson` → `id-badge`, `driver-license`, `member-card`
- `Cart` → `shopping`, `basket`, `buy`
- `Chart` → `graph`, `analytics`, `data`
- `Check` → `tick`, `confirm`, `done`
- `CheckCircle` → `success`, `verified`, `approved`
- `CheckCircleFilled` → `success-filled`, `verified-solid`, `confirmed-selected`
- `CheckDouble` → `read-receipt`, `double-tick`, `delivered`
- `ChevronDown` → `dropdown`, `expand`, `caret-down`
- `ChevronLeft` → `back`, `previous`, `caret-left`
- `ChevronLeftDouble` → `first`, `rewind`, `previous-all`
- `ChevronRight` → `next`, `forward`, `caret-right`
- `ChevronRightDouble` → `last`, `fast-forward`, `next-all`
- `ChevronUp` → `collapse`, `up-arrow`, `caret-up`
- `ChevronUpDown` → `sort`, `reorder`, `select`
- `Circle` → `ring`, `dot`, `round`
- `CircleArrow` → `direction`, `rotate`, `round-arrow`
- `CircleArrowsDiff` → `swap-circle`, `refresh-swap`, `exchange-round`
- `CircleArrowsDiffDisabled` → `swap-off-circle`, `no-exchange`, `disabled-swap`
- `CircleConcentricFilled` → `target`, `radar`, `bullseye`
- `CircleConcentricThree` → `ripple`, `signal-strong`, `concentric`
- `CircleConcentricTwo` → `ripple-two`, `signal-weak`, `two-ring`
- `CircleExclamation` → `alert`, `warning`, `notice`
- `CircleExclamationFilled` → `alert-filled`, `warning-solid`, `error-selected`
- `CircleFastForward` → `next-track`, `skip-forward`, `fast-forward-circle`
- `CircleFilled` → `dot-filled`, `solid-dot`, `bullet`
- `CircleGrid` → `dot-grid`, `pattern`, `apps`
- `CirclePlay` → `play`, `video`, `start`
- `CircleQuestion` → `help`, `info`, `question-mark`
- `CircleSlash` → `disabled`, `prohibit`, `ban`
- `Clipboard` → `copy`, `paste`, `board`
- `ClipboardCheck` → `task-done`, `checklist`, `completed`
- `Clock` → `time`, `hour`, `watch`
- `ClockDefer` → `snooze`, `postpone`, `delay`
- `ClockFilled` → `time-filled`, `solid-clock`, `hour-selected`
- `ClockSixteenHour` → `hos`, `hours-of-service`, `16-hour`
- `Cloud` → `weather`, `storage`, `sky`
- `CloudEllipses` → `loading-cloud`, `cloud-more`, `cloud-menu`
- `CloudLightning` → `storm`, `thunder`, `severe-weather`
- `CloudRain` → `rain`, `wet`, `precipitation`
- `CloudRainSun` → `partly-rainy`, `sun-shower`, `mixed-weather`
- `CloudSun` → `partly-cloudy`, `day`, `mild`
- `CloudWind` → `windy`, `breeze`, `gust`
- `Cluster` → `group`, `nodes`, `bundle`
- `Coin` → `money`, `currency`, `token`
- `CoinStack` → `savings`, `wealth`, `money-stack`
- `CoinStackGeneral` → `finance`, `money-general`, `coins`
- `Compass` → `navigate`, `direction`, `explore`
- `Copy` → `duplicate`, `clone`, `paste`
- `Crop` → `trim`, `cut`, `resize-image`
- `Cross` → `close`, `x`, `cancel`
- `CrossCircle` → `close-circle`, `cancel-round`, `error-x`
- `CrossCircleFilled` → `error-filled`, `cancel-solid`, `close-selected`
- `Cube` → `3d`, `box`, `package`
- `Cup` → `drink`, `coffee`, `beverage`
- `CursorPointer` → `click`, `mouse`, `select`

### D

- `Dashboard` → `overview`, `home`, `panel`
- `Dashcam` → `car-camera`, `vehicle-camera`, `in-car-cam`
- `DashcamLiveStream` → `live-camera`, `live-feed`, `stream`
- `Devices` → `screens`, `gadgets`, `hardware`
- `Document` → `file`, `page`, `doc`
- `DocumentArrow` → `file-move`, `file-transfer`, `file-arrow`
- `DocumentChart` → `report`, `analytics-doc`, `data-report`
- `DocumentDollar` → `invoice`, `bill`, `receipt`
- `DocumentGear` → `file-settings`, `config-file`, `doc-config`
- `DocumentInverted` → `notes`, `sticky-note`, `post-it`
- `DocumentPencil` → `edit-file`, `draft`, `write-doc`
- `DocumentPlus` → `new-file`, `add-document`, `create-doc`
- `DocumentQuestion` → `doc-help`, `unknown-file`, `file-query`
- `DocumentReceipt` → `receipt`, `invoice`, `proof-of-purchase`
- `DocumentStacked` → `files`, `document-list`, `multiple-docs`
- `DoorSensor` → `door`, `entry-sensor`, `access-sensor`
- `DotPath` → `route`, `trail`, `breadcrumb`
- `Download` → `save`, `import`, `get`
- `Drag` → `move`, `reorder`, `grab`

### E

- `Ellipses` → `more`, `menu`, `three-dots`
- `Email` → `mail`, `envelope`, `message`
- `Engine` → `motor`, `machinery`, `powertrain`
- `Enter` → `submit`, `return`, `go`
- `EntityAsset` → `asset`, `equipment`, `tracked-item`, `marker`
- `EntityAssetFilled` → `asset-filled`, `equipment-solid`, `asset-selected`, `marker`
- `EntityDriver` → `driver`, `operator`, `trucker`, `marker`
- `EntityDriverFilled` → `driver-filled`, `operator-solid`, `driver-selected`, `marker`
- `EntityTravelGroup` → `trip-group`, `convoy`, `travel-party`, `marker`
- `EntityTravelGroupFilled` → `convoy-filled`, `trip-group-solid`, `travel-group-selected`, `marker`
- `EntityVehicle` → `vehicle`, `truck`, `car`, `marker`
- `EntityVehicleCharging` → `ev-charging`, `electric-charge`, `vehicle-plug`, `marker`
- `EntityVehicleChargingFilled` → `ev-charging-filled`, `electric-solid`, `charging-selected`, `marker`
- `EntityVehicleFilled` → `vehicle-filled`, `truck-solid`, `vehicle-selected`, `marker`
- `EntityVehicleImmobilized` → `stopped-vehicle`, `disabled-car`, `immobilized`, `marker`
- `EntityVehicleImmobilizedFilled` → `immobilized-filled`, `stopped-solid`, `immobilized-selected`, `marker`
- `ErrorTriangle` → `warning`, `caution`, `alert-triangle`
- `ErrorTriangleFilled` → `warning-filled`, `caution-solid`, `alert-selected`
- `ErrorTriangleSimpleFilled` → `warning-simple`, `basic-alert`, `simple-caution`
- `Export` → `share-out`, `send`, `outbound`
- `ExternalLink` → `open-new`, `launch`, `new-tab`
- `Eye` → `view`, `show`, `visible`
- `EyeDisabled` → `hide`, `invisible`, `hidden`
- `EyeLock` → `private-view`, `restricted-view`, `secure-view`

### F

- `FastForward` → `skip`, `forward`, `ff`
- `FastForwardSkip` → `skip-forward`, `next-chapter`, `jump-ahead`
- `Filters` → `filter`, `sort`, `refine`
- `FitToScreen` → `fit`, `auto-size`, `contain`
- `Flag` → `banner`, `marker`, `country`
- `FlagFilled` → `flag-filled`, `marker-solid`, `priority`
- `FloppyDisk` → `save`, `storage`, `disk`
- `Folder` → `directory`, `folder-closed`, `group`
- `FolderFilled` → `folder-filled`, `directory-solid`, `folder-selected`
- `FuelPump` → `gas-pump`, `fuel`, `petrol-station`
- `FullScreen` → `expand`, `maximize`, `enlarge`
- `FullScreenExit` → `minimize`, `exit-fullscreen`, `shrink`

### G

- `Gauge` → `meter`, `speedometer`, `dial`
- `Gear` → `settings`, `cog`, `config`
- `GearCheck` → `settings-applied`, `config-done`, `settings-verified`
- `Geofence` → `virtual-boundary`, `zone`, `area`
- `GeofenceCircle` → `circular-zone`, `round-fence`, `radius-zone`
- `GeofenceDiamond` → `diamond-zone`, `angular-fence`, `rhombus-zone`
- `GeofenceSquare` → `square-zone`, `rectangular-fence`, `box-zone`
- `GlobeNetwork` → `network`, `internet`, `worldwide`
- `GlobeWorldMap` → `world`, `earth`, `map`
- `Graph` → `chart`, `diagram`, `plot`
- `GraphArrow` → `trend`, `growth`, `chart-arrow`
- `GraphBars` → `bar-chart`, `histogram`, `columns`
- `GraphDecreasing` → `downtrend`, `decline`, `decrease`
- `GraphIncreasing` → `uptrend`, `growth`, `increase`
- `GroupBy` → `group`, `cluster`, `categorize`
- `GaugeTemperature` → `thermometer`, `temp`, `climate`

### H

- `Hamburger` → `menu`, `nav`, `lines`
- `Headset` → `headphones`, `support`, `call-center`
- `History` → `recent`, `past`, `timeline`
- `HourGlass` → `time`, `waiting`, `loading`

### I

- `Image` → `picture`, `photo`, `media`
- `Import` → `download`, `bring-in`, `load`
- `ImportClock` → `scheduled-import`, `pending-import`, `import-time`
- `Inbox` → `mailbox`, `messages`, `tray`
- `IosFilled` → `apple`, `ios`, `ios-logo`

### J

- `Jerrycan` → `fuel-can`, `gas-can`, `canister`

### K

- `KeyA` → `key`, `password`, `access`
- `KeyB` → `key-alt`, `secondary-key`, `password-variant`

### L

- `LED` → `light`, `indicator`, `signal`
- `Layers` → `stack`, `levels`, `overlay`
- `Leaf` → `eco`, `green`, `nature`
- `LeftTurnSignal` → `left-turn`, `left-blinker`, `turn-left`
- `LetterB` → `letter-b`, `b`, `character-b`
- `LetterC` → `letter-c`, `c`, `character-c`
- `LetterI` → `letter-i`, `i`, `character-i`
- `License` → `credential`, `permit`, `certification`
- `LicensePlate` → `plate`, `registration`, `car-plate`
- `Lifebuoy` → `help`, `support`, `rescue`
- `Lightning` → `bolt`, `fast`, `power`
- `LightningFilled` → `bolt-filled`, `fast-solid`, `lightning-selected`
- `Link` → `url`, `hyperlink`, `chain`
- `List` → `ul`, `items`, `lines`
- `Loads` → `cargo`, `freight`, `shipments`
- `LocationPin` → `pin`, `marker`, `place`
- `LocationPinArrows` → `location-direction`, `pin-movement`, `gps-arrows`
- `LocationPinDisabled` → `no-location`, `pin-off`, `location-off`
- `LocationPinDollar` → `paid-location`, `location-cost`, `destination-price`
- `LockClosed` → `locked`, `secure`, `private`
- `LockClosedFilled` → `locked-filled`, `secure-solid`, `locked-selected`
- `LockOpen` → `unlocked`, `open`, `unsecure`
- `Logout` → `sign-out`, `exit`, `leave`
- `Logs` → `records`, `event-log`, `events`
- `LogsMagnifyingGlass` → `search-logs`, `inspect-logs`, `logs-zoom`

### M

- `MagnifyingGlass` → `search`, `find`, `zoom`
- `MagnifyingGlassGraph` → `search-analytics`, `inspect-graph`, `data-search`
- `MagnifyingGlassZoomIn` → `zoom-in`, `enlarge`, `plus-zoom`
- `MagnifyingGlassZoomOut` → `zoom-out`, `reduce`, `minus-zoom`
- `MapA` → `map`, `navigation`, `atlas`
- `MapB` → `map-alt`, `map-variant`, `navigation-b`
- `MapBBetaBottom` → `map-beta-bottom`, `beta-map-bottom`, `experimental-map-bottom`
- `MapBBetaTop` → `map-beta-top`, `beta-map-top`, `experimental-map-top`
- `MapNavigation` → `directions`, `navigate`, `route-map`
- `MarkRead` → `read`, `seen`, `envelope-open`
- `Match` → `matching`, `equal`, `linked`
- `MenuCollapse` → `collapse-menu`, `hide-sidebar`, `nav-collapse`
- `MenuCollapseB` → `collapse-menu-alt`, `hide-sidebar-alt`, `nav-collapse-variant`
- `MenuExpand` → `expand-menu`, `show-sidebar`, `nav-expand`
- `MenuExpandB` → `expand-menu-alt`, `show-sidebar-alt`, `nav-expand-variant`
- `MessageBubble` → `chat`, `message`, `comment`
- `MessageBubbleStack` → `conversation`, `messages`, `chat-list`
- `Messaging` → `chat`, `sms`, `texting`
- `Mic` → `microphone`, `record`, `audio`
- `MicMute` → `mic-off`, `muted-mic`, `no-audio`
- `Minimize` → `collapse`, `reduce`, `shrink`
- `Mobile` → `phone`, `smartphone`, `cellular`
- `Monitor` → `screen`, `display`, `desktop`

### N

- `Notification` → `bell`, `alert`, `notice`
- `NumberTen` → `10`, `number-ten`, `ten`

### O

- `OctagonSubtract` → `stop`, `restricted`, `prohibited`
- `Odometer` → `mileage`, `distance`, `odo`
- `Omnicam` → `360-camera`, `side-camera`, `all-around-cam`
- `OverviewAI` → `ai-overview`, `smart-summary`, `ai-dashboard`

### P

- `PanelCollapse` → `collapse-panel`, `close-panel`, `hide-panel`
- `PanelExpand` → `expand-panel`, `open-panel`, `show-panel`
- `Paperclip` → `attach`, `attachment`, `clip`
- `PaperplaneMarker` → `send-location`, `send-marker`, `location-send`
- `PaperplaneSend` → `send`, `submit`, `deliver`
- `Paragraph` → `text-block`, `pilcrow`, `paragraph-mark`
- `ParagraphPencil` → `edit-text`, `text-edit`, `paragraph-edit`
- `Pause` → `stop-playback`, `pause-media`, `hold`
- `PauseFilled` → `pause-filled`, `hold-solid`, `pause-selected`
- `Pencil` → `edit`, `write`, `modify`
- `PencilSquiggle` → `sketch`, `draw`, `scribble`
- `Person` → `user`, `profile`, `individual`
- `PersonAt` → `mention-user`, `user-tag`, `person-mention`
- `PersonConnect` → `add-contact`, `connect-user`, `person-link`
- `PersonFrame` → `user-photo`, `profile-frame`, `person-in-frame`
- `PersonGear` → `user-settings`, `profile-config`, `account-settings`
- `PersonGroup` → `team`, `users`, `people`
- `PersonGroupArrows` → `team-sync`, `group-transfer`, `user-group-arrows`
- `PersonManager` → `manager`, `supervisor`, `admin`
- `PersonShield` → `admin`, `secure-user`, `protected-user`
- `PersonStar` → `vip`, `favorite-user`, `starred-person`
- `Phone` → `call`, `telephone`, `contact`
- `PhoneDisconnect` → `hang-up`, `end-call`, `phone-off`
- `PicmanFilled` → `picman`, `google-street-view`, `street-view`
- `PipBottomLeft` → `pip-bottom-left`, `picture-in-picture-bl`, `overlay-bl`
- `PipBottomRight` → `pip-bottom-right`, `picture-in-picture-br`, `overlay-br`
- `PipTopLeft` → `pip-top-left`, `picture-in-picture-tl`, `overlay-tl`
- `PipTopRight` → `pip-top-right`, `picture-in-picture-tr`, `overlay-tr`
- `Play` → `start`, `begin`, `run`
- `PlayFilled` → `play-filled`, `start-solid`, `play-selected`
- `Plug` → `power`, `connect`, `outlet`
- `Plus` → `add`, `create`, `new`
- `PlusCircle` → `add-circle`, `create-round`, `new-item`
- `Preferences` → `settings`, `options`, `config`
- `Printer` → `print`, `fax`, `output`
- `PunchCard` → `timesheet`, `attendance`, `punch-clock`
- `Puzzle` → `plugin`, `extension`, `piece`
- `PuzzleJoined` → `integrated`, `connected-plugin`, `assembled`

### R

- `Redo` → `redo`, `forward-action`, `repeat-action`
- `Refresh` → `reload`, `sync`, `update`
- `Restore` → `revert`, `undo-delete`, `recover`
- `RewardRibbon` → `award`, `badge`, `achievement`
- `Rewind` → `back`, `previous`, `replay`
- `RewindSkip` → `skip-back`, `previous-chapter`, `jump-back`
- `RewindSkipFilled` → `skip-back-filled`, `previous-solid`, `rewind-selected`
- `RightTurnSignal` → `right-turn`, `right-blinker`, `turn-right`
- `Rotate` → `spin`, `turn`, `orient`

### S

- `Satellite` → `gps`, `satellite-dish`, `broadcast`
- `Scan` → `qr-scan`, `barcode-scan`, `scanner`
- `Scissor` → `cut`, `scissors`, `trim`
- `Scope` → `target`, `crosshair`, `aim`
- `Seatbelt` → `safety-belt`, `buckle-up`, `restraint`
- `SeatbeltBuckle` → `buckle`, `belt-fastener`, `belt-clip`
- `Sensor` → `detector`, `probe`, `monitor-sensor`
- `Shapes` → `geometry`, `forms`, `primitives`
- `ShareCircles` → `share`, `social-share`, `distribute`
- `ShareCirclesFilled` → `share-filled`, `social-share-solid`, `share-selected`
- `SharePaperplane` → `send`, `share-send`, `forward`
- `Shield` → `protect`, `security`, `guard`
- `ShieldCheck` → `verified`, `approved-security`, `secure-confirmed`
- `ShieldCheckmarkFilled` → `verified-filled`, `approved-solid`, `trusted-selected`
- `ShieldCircle` → `protected-circle`, `secure-round`, `guard-circle`
- `ShieldCircleFilled` → `protected-filled`, `secure-circle-solid`, `guard-selected`
- `ShieldCross` → `insecure`, `protection-off`, `shield-x`
- `ShieldCrossFilled` → `insecure-filled`, `protection-off-solid`, `shield-x-selected`
- `ShieldFilled` → `shield-filled`, `protection-solid`, `shield-selected`
- `ShieldLock` → `secure-lock`, `encrypted`, `password-protected`
- `ShieldLockFilled` → `secure-lock-filled`, `encrypted-solid`, `secured-selected`
- `ShoppingBag` → `bag`, `purchase`, `shop`
- `Snowflake` → `cold`, `winter`, `freeze`
- `SpeakerPhone` → `loudspeaker`, `hands-free`, `speaker-on`
- `SpeedometerArrow` → `speedometer`, `gauge-arrow`, `rpm`
- `SpeedometerLeft` → `speedometer-left`, `gauge-left`, `slow`
- `SpeedometerRight` → `speedometer-right`, `gauge-right`, `fast`
- `SpikeCirclePercentage` → `spike-percent`, `surge`, `anomaly-percent`
- `SpikeCirclePercentageFilled` → `spike-percent-filled`, `surge-solid`, `anomaly-selected`
- `Square` → `rectangle`, `box-outline`, `quadrilateral`
- `SquareCheck` → `checkbox-checked`, `tick-box`, `square-tick`
- `SquareDollarFilled` → `dollar-square`, `money-box`, `price-box`
- `SquareGrid` → `grid`, `apps`, `squares`
- `SquarePencil` → `edit-box`, `text-edit-square`, `compose`
- `SquarePlus` → `add-box`, `new-square`, `plus-box`
- `SquareSubtract` → `remove-box`, `minus-box`, `subtract-square`
- `Star` → `favorite`, `rate`, `featured`
- `StarFilled` → `favorite-filled`, `rated-solid`, `star-selected`
- `Stopwatch` → `timer`, `chronometer`, `lap`
- `Street` → `road`, `path`, `avenue`
- `Subtract` → `minus`, `remove`, `decrement`
- `SubtractCircle` → `minus-circle`, `remove-round`, `decrement-circle`

### T

- `Table` → `grid`, `spreadsheet`, `rows`
- `Tag` → `label`, `price-tag`, `category`
- `Target` → `goal`, `bullseye`, `aim`
- `TargetDollar` → `price-target`, `goal-money`, `revenue-target`
- `Text` → `font`, `typography`, `text-content`
- `ThemeDark` → `dark-mode`, `night-mode`, `dark`
- `ThemeLight` → `light-mode`, `day-mode`, `light`
- `ThumbsDown` → `dislike`, `downvote`, `negative`
- `ThumbsDownFilled` → `dislike-filled`, `downvote-solid`, `negative-selected`
- `ThumbsUp` → `like`, `upvote`, `positive`
- `ThumbsUpFilled` → `like-filled`, `upvote-solid`, `positive-selected`
- `TirePressure` → `tpms`, `tire`, `pressure-sensor`
- `Toggle` → `switch`, `on-off`, `flip`
- `TrafficLight` → `signal`, `traffic-signal`, `semaphore`
- `Trash` → `delete`, `remove`, `bin`
- `Trophy` → `award`, `winner`, `achievement`
- `TurnSignal` → `blinker`, `indicator`, `signal-light`
- `TurnSignalFilled` → `blinker-filled`, `indicator-solid`, `signal-selected`
- `TwoDevices` → `multi-device`, `dual-screen`, `two-screens`

### U

- `Undo` → `back`, `revert`, `previous-action`
- `Upgrade` → `improve`, `level-up`, `promote`
- `Upload` → `send-up`, `publish`, `push`

### V

- `VehicleGateway` → `telematics-gateway`, `vehicle-hub`, `fleet-gateway`
- `VehicleTrailer` → `trailer`, `container-trailer`, `truck-trailer`
- `VehicleTruck` → `truck`, `lorry`, `semi`
- `VehicleTruckMagnifyingGlass` → `truck-search`, `find-truck`, `inspect-vehicle`
- `Video` → `movie`, `film`, `recording`
- `ViewMenu` → `view`, `display-menu`, `layout-options`
- `Volume` → `sound`, `audio`, `speaker-volume`
- `VolumeFilled` → `sound-filled`, `audio-solid`, `volume-selected`
- `VolumeMute` → `muted`, `silent`, `no-sound`
- `VolumeMuteFilled` → `muted-filled`, `silent-solid`, `mute-selected`

### W

- `WandSparkle` → `magic`, `ai-wand`, `enchant`
- `Waveform` → `audio-wave`, `sound-wave`, `signal-wave`
- `Webhooks` → `webhook`, `api-hook`, `integration`
- `Whistle` → `referee`, `warning-whistle`, `alarm-whistle`
- `WiFiHorizontal` → `wifi`, `wireless-horizontal`, `internet-h`
- `WiFiTower` → `cell-tower`, `wifi-antenna`, `broadcast-tower`
- `WifiVertical` → `wifi`, `wireless`, `internet`
- `WifiVerticalFilled` → `wifi-filled`, `wireless-solid`, `wifi-selected`
- `WifiVerticalFilledDisabled` → `wifi-off`, `no-wireless`, `wifi-disabled`
- `WorkflowA` → `flow`, `process`, `pipeline`
- `WorkflowB` → `flow-alt`, `process-variant`, `pipeline-alt`
- `Wrench` → `tool`, `fix`, `maintenance`

### Z

- `ZoomBackOut` → `zoom-out`, `back-zoom`, `reduce-zoom`

---

## Next steps

Once you've reviewed and edited:

1. I'll convert each entry to a sidecar `src/icons/<IconName>.json`
2. Update `scripts/build.mjs` to read sidecars and emit `dist/meta.json` (agent-facing manifest)
3. Update `scripts/build-docs.mjs` so search matches on name + aliases
4. Add `"./meta"` export to `package.json` for `import meta from '@ds-mo/icons/meta'`

Reply with edits inline, or just say "looks good" to proceed.
