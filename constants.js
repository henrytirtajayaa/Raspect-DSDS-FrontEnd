export const apiKey = "3490454f4ced4deb95bf1a4e66670a10";
export const MARKER_FILTER_ALL="ALL";
export const MARKER_FILTER_DEFECT_ONLY="DEFECT_ONLY";
export const MARKER_FILTER_NORMAL_ONLY="NORMAL_ONLY";
export const FILTER_ALL_MARKER = "FILTER_ALL_MARKER";
export const FILTER_ALL_TRIPS = "FILTER_ALL_TRIPS";
export const FILTER_ALL_TYPES = "FILTER_ALL_TYPES";
export const DEFECT_TYPES = [
    {
        title: "(a) Damaged Display",
        id: "damagedDisplay",
        letterGrade: "A",
        desc: "Broken or missing display surface inside structural frames"
    },
    {
        title: "(b) Missing Display",
        id: "missingDisplay",
        letterGrade: "B",
        desc: "No display surface with only structural support attached to other building structure"
    },
    {
        title: "(c) Derelict",
        id: "derelict",
        letterGrade: "C",
        desc: "Showing obsolete, dilapidated or derelict condition"
    },
    {
        title: "(d) Rust",
        id: "rust",
        letterGrade: "D",
        desc: "Substantial corrosion with obvious signs such as rusty water marks"
    },
    {
        title: "(e) Deformed Structure",
        id: "deformedStructure",
        letterGrade: "E",
        desc: "Evident structural distortion, deformation, sagging, rupture, loosening and detachment of any of its components"
    }
];
export const DEFAULT_FILTER = {
    survey: {
        surveyId: { isChecked: false, value: [] },
        surveyDateRange: { isChecked: false, value: [] },
        tripId: { isChecked: false, value: '' },
    },
    signboard: {
        signboardId: { isChecked: false, value: [] },
        sampled: { isChecked: false, value: '' },
        verified : { isChecked: false, value: '' },
        fileRef: { isChecked: false, value: [] },
        headroom: { isChecked: false, value: [] },
        projection: { isChecked: false, value: [] },
        signboardType : { isChecked: false, value: "" },
        defectTypes: { isChecked: false, value: [] },
    },
    location: {
        areaCode: { isChecked: false, value: [] },
        englishAddress: { isChecked: false, value: [] },
    },
    peopleInCharge: {
        seniorPro: { isChecked: false, value: [] },
        caseOfficer: { isChecked: false, value: [] },
        caseAssistant: { isChecked: false, value: [] }
    },
    modification: {
        signboardIdentificationRevised: { isChecked: false, value: "" },
        boundingAreaRevised: { isChecked: false, value: "" },
        defectiveSignboardRevised: { isChecked: false, value: "" },
        defectTypeModified: { isChecked: false, value: "" },
        defectTypeOriginal: { isChecked: false, value: [] }
    },
    dsrn: {
        dsrnToBeServed: { isChecked: false, value: "" },
        dsrnNo: { isChecked: false, value: [] },
        dsrnNotServeReason: { isChecked: false, value: [] },
        account: { isChecked: false, value: "" },
        signboardOwnerNAddress: { isChecked: false, value: [] },
        inspectionProformaPath: { isChecked: false, value: "" },
        dsrnPath: { isChecked: false, value: "" },
        coveringLetterPath: { isChecked: false, value: "" },
        actionTaken: { isChecked: false, value: "" },
    }
}

export const AnnotationText = {
    fontFamily: "Avenir Next",
    fontSize: 12,
    textAlign: "center",
    originX: "left",
    originY: "center"
}

export const SIGNBOARD_TYPE_NAME_MAP = {
    normal: "Normal",
    defective: "Defective"
}

export const MODIFICATION_NAME_MAP = {
    noChange: "No Change",
    normal: "Normal",
    defective: "Defective",
    added: "Added",
    deleted: "Deleted"
}

export const DEFAULT_DISPLAY_FIELDS = [
    {
        id: "signboardId",
        text: "Signboard ID"
    },
    {
        id: "surveyId",
        text: "Survey Batch ID"
    },
    {
        id: "tripId",
        text: "Trip ID"
    },
    {
        id: "surveyDate",
        text: "Survey Date"
    },
    {
        id: "areaCode",
        text: "Area Code"
    },
    {
        id: "englishAddress",
        text: "Street Name (English)"
    },
    {
        id: "fileRef",
        text: "BD File Reference"
    },
    {
        id: "signboardType",
        text: "Signboard Type"
    },
    {
        id: "dsrnNo",
        text: "DSRN No"
    }
]

export const FILTER_MAPPING = {
    areaCode: "location",
    defectTypes: "signboard",
    englishAddress: "location",
    headroom: "signboard",
    projection: "signboard",
    signboardId: "signboard",
    tripId: "survey",
    sampled: "signboard",
    fileRef: "signboard",
    surveyDateRange: "survey",
    surveyId: "survey",
    signboardType: "signboard",
    boundingAreaRevised: "modification",
    signboardIdentificationRevised: "modification",
    defectiveSignboardRevised: "modification",
    defectTypeModified: "modification",
    defectTypeOriginal: "modification",
    dsrnToBeServed: "dsrn",
    dsrnNo: "dsrn",
    dsrnNotServeReason: "dsrn",
    account: "dsrn",
    signboardOwnerNAddress: "dsrn",
    inspectionProformaPath: "dsrn",
    dsrnPath: "dsrn",
    coveringLetterPath: "dsrn",
    actionTaken: "dsrn"
}

export const DEFAULT_HEADERS = [
    {
        id: "signboardId",
        text: "Signboard ID",
        align: 'start',
        sortable: true,
        value: 'signboardId'
    },
    {
        id: "verified",
        text: "Verification",
        align: 'start',
        sortable: true,
        value: 'verified'
    },
    {
        id: "surveyId",
        text: "Survey Batch ID",
        align: "start",
        sortable: true,
        value: "surveyId"
    },
    {
        id: "tripId",
        text: "Trip ID",
        align: "start",
        sortable: true,
        value: "tripId"
    },
    {
        id: "surveyDate",
        text: "Survey Date",
        align: "start",
        sortable: true,
        value: "surveyStartTime"
    },
    {
        id: "areaCode",
        text: "Area Code",
        align: "start",
        sortable: true,
        value: "areaCode"
    },
    {
        id: "englishAddress",
        text: "Street Name and Building Name",
        align: "start",
        sortable: true,
        value: "englishAddress"
    },
    {
        id: "fileRef",
        text: "BD File Reference",
        align: "start",
        sortable: true,
        value: "fileRef"
    },
    {
        id: "signboardType",
        text: "Signboard Type",
        align: "start",
        sortable: true,
        value: "signboardType"
    },
    {
        id: "dsrnNo",
        text: "DSRN No",
        align: "start",
        sortable: true,
        value: "dsrnNo"
    },
]

export const TAB_MAP = {
    survey: "surveyId",
    signboard: "signboardId",
    tripId: "tripId",
    location: "areaCode",
    peopleInCharge: "seniorPro",
    modification: "signboardIdentificationRevised",
    dsrn: "dsrnToBeServed"
}

export const USER_ROLE = {
    STANDARD: 'standard',
    ADMIN: 'admin',
    SUPER_ADMIN: 'superAdmin',
    API: 'apiUser'
}

export const USER_ROLE_NAME = {
    [USER_ROLE.STANDARD]: "Standard",
    [USER_ROLE.ADMIN]: "Admin",
    [USER_ROLE.SUPER_ADMIN]: "Super Admin",
    [USER_ROLE.API]: "API User"
}

export const ROLES = [
    { value: "standard", text: "Standard" },
    { value: "admin", text: "Admin" },
    { value: "superAdmin", text: "Super Admin"}
]

export const DEFAULT_SEARCH_VALUES = {
    boundary: {
        bound: {
            topLeft: [114.51, 22.58],
            bottomRight: [113.76, 22.13]
        },
        precision: 5
    }
}

export const TRIP_DETAIL_MEDIUM_VIEWPORT = 1034
export const DEFAULT_PREVIEW_IMAGE_WIDTH = 320
export const DEFAULT_PREVIEW_IMAGE_HEIGHT = 213

export const LATEST_TRIPS_HEADERS = [
    { text: 'Trip Date', value: 'tripDate' },
    { text: 'Survey ID', value: 'surveyId' },
    { text: 'Trip ID', value: 'tripId' },
    { text: 'No. of Normal Signboard', value: 'normalSignboard' },
    { text: 'No. of Defective Signboard', value: 'defectSignboard' },
    { text: 'To Map/Trip Data', value: 'arrow' },
]

export const CONTENT_LIST = [
    {
        title: 'Signboard Map',
        to: '/signboard-map',
        icon: 'CommonFindSignboardIconLarge'
    },
    {
        title: 'Trip Data',
        to: '/inspect-route',
        icon: 'CommonTripDataIconLarge'
    },
    {
        title: 'Signboard List',
        to: '/record-list',
        icon: 'CommonSignboardListIconLarge'
    },
    {
        title: 'Modified Items',
        to: '',
        icon: 'CommonModifiedItemsIconLarge'
    },
    {
        title: 'Define Survey Area',
        to: '/survey',
        icon: 'CommonDefineSurveyAreaIcon'
    },
    {
        title: 'Assign Officer',
        to: '/assign-people',
        icon: 'CommonAssignPeopleIcon'
    },
    {
        title: 'Performance',
        to: '/performance',
        icon: 'CommonPerformanceIconLarge'
    },
    {
        title: 'Setting',
        to: '/settings',
        icon: 'CommonSettingIconLarge'
    }
]

export const YEARS = [
    { id: "2019", title: "2019"},
    { id: "2020", title: "2020"},
    { id: "2021", title: "2021"},
    { id: "2022", title: "2022"},
    { id: "2023", title: "2023"}
]

export const MONTHS = [
    { id: "January", title: "January"},
    { id: "February", title: "February"},
    { id: "March", title: "March"},
    { id: "April", title: "April"},
    { id: "May", title: "May"},
    { id: "June", title: "June"},
    { id: "July", title: "July"},
    { id: "August", title: "August"},
    { id: "September", title: "September"},
    { id: "October", title: "October"},
    { id: "November", title: "November"},
    { id: "December", title: "December"}
]

export const DAYS = [
    { id: "1", title: "1"},
    { id: "2", title: "2"},
    { id: "3", title: "3"},
    { id: "4", title: "4"},
    { id: "5", title: "5"},
    { id: "6", title: "6"},
    { id: "7", title: "7"},
    { id: "8", title: "8"},
    { id: "9", title: "9"},
    { id: "10", title: "10"},
    { id: "11", title: "11"},
    { id: "12", title: "12"},
    { id: "13", title: "13"},
    { id: "14", title: "14"},
    { id: "15", title: "15"},
    { id: "16", title: "16"},
    { id: "17", title: "17"},
    { id: "18", title: "18"},
    { id: "19", title: "19"},
    { id: "20", title: "20"},
    { id: "21", title: "21"},
    { id: "22", title: "22"},
    { id: "23", title: "23"},
    { id: "24", title: "24"},
    { id: "25", title: "25"},
    { id: "26", title: "26"},
    { id: "27", title: "27"},
    { id: "28", title: "28"},
    { id: "29", title: "29"},
    { id: "30", title: "30"},
    { id: "31", title: "31"},
]

export const DSRN_ACTION = [
    { id: "a", title: "Immediate BDC action"},
    { id: "b", title: "To serve DSRN"},
    { id: "c", title: "Re-inspection after __ weeks"},
]
export const APPROVAL_STATUS = [
  { value: "Approved", text: "Approved" },
  { value: "Not Yet Approved", text: "Not Yet Approved" }
];


export const ASSIGN_PEOPLE_HEADER = [
    { text: "SPO", value: "seniorPro", align: "center" },
    { text: "TL", value: "caseOfficer", align: "center" },
    { text: "TA", value: "caseAssistant", align: "center" },
    { text: "", value: "delete" }
];

export const ASSIGN_PEOPLE_CONFIRMATION_HEADER = [
  { text: "SPO", value: "seniorPro" },
  { text: "TL", value: "caseOfficer" },
  { text: "TA", value: "caseAssistant" }
];

export const NEW_POLYGON_PRESETS = {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 4,
    stroke: "yellow",
    scaleX: 1,
    scaleY: 1,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "blue",
    selectable: true
};

export const GROUP_PRESETS = {
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    lockScalingFlip: true,
    lockRotation: true
};

export const RECTANGLE_PRESETS = {
    fill: "transparent",
    stroke: "green",
    strokeWidth: 3,
    originX: "left",
    originY: "top",
};

export const SHEET_SETTINGS = {
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: false
};

export const SHEET_PRESETS = {
    opacity: 0.5,
    fill: "white",
    hoverCursor: "crosshair",
    selectable: false
};

export const DSRN_REASONS = [
    {
        id: "a",
        text: "DSRN/ s.24 order was issued",
        value: "dsrnIssued"
    },
    {
        id: "b",
        text: "The sign was erected or maintained by other B/Ds",
        value: "signMaintained"
    },
    {
        id: "c",
        text: "Not likely to become dangerous",
        value: "notDangerous"
    },
    {
        id: "d",
        text: "Keep in view",
        value: "keepView"
    },
    {
        id: "e",
        text: "Others",
        value: "otherReasons"
    }
];

export const DSRN_ACCOUNT = [
  {
    text: "Public Account",
    value: "public"
  },
  {
    text: "Advance Account",
    value: "advance"
  }
];

// export const DEFAULT_BOUNDARY = [[114.148161, 22.340385], [114.271427, 22.313055]]; // BEFORE
export const DEFAULT_BOUNDARY = [[113.809735, 22.620923], [114.374095, 22.181479]]; // WHOLE HONGKONG COORDINATES

export const SIGNBOARD_TYPE = [
    {
        id: "defectSign",
        title: "Defective (破損)"
    },
    {
        id: "abandonedSign",
        title: "Abandoned (棄置)"
    },
    {
        id: "advertisementSign",
        title: "Advertisement signboard and supporting frame (招牌支承構架連招牌)"
    },
    {
        id: "supportingFrame",
        title: "Supporting frame of advertisement signboard (招牌支承構架)"
    }
];

export const POST_LIST = {
    ["SC"]: {
        en: "Signboard Control",
        cn: "招牌監管"
    },
    ["BS"]: {
        en: "Building Surveyor",
        cn: "屋宇測量師"
    },
    ["SE"]: {
        en: "Structural Engineer",
        cn: "結構工程師"
    },
    ["TO"]: {
        en: "Technical Officer",
        cn: "技術主任"
    },
    ["SO"]: {
        en: "Survey Officer",
        cn: "測量主任"
    },
    ["PO"]: {
        en: "Professional Officer",
        cn: "專業主任"
    },

    ["SBS"]: {
        en: "Senior Building Surveyor",
        cn: "高級屋宇測量師"
    },
    ["SSE"]: {
        en: "Senior Structural Engineer",
        cn: "高級結構工程師"
    },
    ["STO"]: {
        en: "Senior Technical Officer",
        cn: "高級技術主任"
    },
    ["SSO"]: {
        en: "Senior Survey Officer",
        cn: "高級測量主任"
    },
    ["SPO"]: {
        en: "Senior Professional Officer",
        cn: "高級專業主任"
    },

    ["PTO"]: {
        en: "Principal Technical Officer",
        cn: "首席技術主任"
    },
    ["PSO"]: {
        en: "Principal Survey Officer",
        cn: "首席測量主任"
    },

    ["CTO"]: {
        en: "Chief Technical Officer",
        cn: "總技術主任"
    },
    ["CSO"]: {
        en: "Chief Survey Officer",
        cn: "總測量主任"
    }
};

export const SIGN_TYPE_LIST = {
    ["defectSign"]: {
        en: "Defective Advertisement Signboard",
        cn: "破損招牌"
    },
    ["defectFrame"]: {
        en: "Defective Supporting Frame",
        cn: "破損支承構架"
    },
    ["abandonedSign"]: {
        en: "Abandoned Advertisement Signboard",
        cn: "棄置招牌"
    },
    ["abandonedFrame"]: {
        en: "Abandoned Supporting Frame",
        cn: "棄置招牌"
    }
};

export const SIGN_FILTER_MAP = {
    [MARKER_FILTER_DEFECT_ONLY]: 'defective',
    [MARKER_FILTER_NORMAL_ONLY]: 'normal'
}

export const SIGNBOARD_STATUS = {
    PENDING: "Pending",
    PROCESSED: "Processed"
}

export const REVISION_STATUS = {
    ADDED: "added"
}

export const SAMPLE_VALUE = [
    { value: 10, title: '10%'},
    { value: 20, title: '20%'},
    { value: 30, title: '30%'},
    { value: 40, title: '40%'},
    { value: 50, title: '50%'},
    { value: 60, title: '60%'},
    { value: 70, title: '70%'},
    { value: 80, title: '80%'},
    { value: 90, title: '90%'},
    { value: 100, title: '100%'},
  ]