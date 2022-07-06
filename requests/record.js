import { ROOT_API } from "./constants";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";

const axios = require("axios").default;

export const getRecords = async ({accessToken}) => {
    try {
        const response = await axios.post(
            `${ROOT_API}/signboards/filter`,
            JSON.stringify({
                page: 0,
                pageSize: 10
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    
        return response;
    } catch(e) {
        return e.response.status;
    }
}

export const filter = async ({ payload, accessToken, ignoreProcessing }) => {
    let { filter, sort } = payload;

    let processedFilter = {...filter, sort};

    if(!ignoreProcessing) {
        
        processedFilter = cleanFilter(filter, sort);
    }

    delete processedFilter.ignoreProcessing;

    try {
        const response = await axios.post(
            `${ROOT_API}/signboards/filter`,
            processedFilter,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    
        return response;
    } catch(e) {
        return e.response.status;
    }
}

export const cleanFilter = (filter, sort) => {
    let filterKeys = Object.keys(filter);
    let processedFilter = {};

    for(let i = 0; i < filterKeys.length ; i ++ ) {
        let object = filter[filterKeys[i]];

        for(const property in object) {
            processedFilter[property] = _get(object, `${property}.value`)
        }
    }

    processedFilter = {
        ...processedFilter,
        sort: !_isEmpty(sort.columnId) ? {
            [sort.columnId]: sort.order === "asc" ? 1 : -1
        } : {},
        surveyDateRange: processedFilter.surveyDateRange.map((date) => moment.utc(date).format())
    }

    JSON.stringify(processedFilter)

    const revisionStatus = {
        "signboardIdentificationRevised": processedFilter.signboardIdentificationRevised,
        "defectiveSignboardRevised": processedFilter.defectiveSignboardRevised,
        "boundingAreaRevised": processedFilter.boundingAreaRevised,
        "defectTypeModified": processedFilter.defectTypeModified,
        "defectTypeOriginal": processedFilter.defectTypeOriginal
    }

    const dsrnHandling = {
        "dsrnToBeServed": processedFilter.dsrnToBeServed,
        "dsrnNo": processedFilter.dsrnNo,
        "dsrnNotServeReason": processedFilter.dsrnNotServeReason,
        "account": processedFilter.account,
        "signboardOwnerNAddress": processedFilter.signboardOwnerNAddress,
        "inspectionProformaPath": processedFilter.inspectionProformaPath,
        "dsrnPath": processedFilter.dsrnPath,
        "coveringLetterPath": processedFilter.coveringLetterPath,
        "actionTaken": processedFilter.actionTaken
    }

    const form = {
        "addressSignOwers": processedFilter.signboardOwnerNAddress
    }

    const peopleInCharge = {
        "seniorPro": processedFilter.seniorPro,
        "caseOfficer": processedFilter.caseOfficer,
        "caseAssistant": processedFilter.caseAssistant
    }

    processedFilter.revisionStatus = revisionStatus;
    processedFilter.dsrnHandling = dsrnHandling;
    processedFilter.form = form;
    processedFilter.peopleInCharge = peopleInCharge;

    delete processedFilter.signboardIdentificationRevised;
    delete processedFilter.boundingAreaRevised;
    delete processedFilter.defectTypeModified;
    delete processedFilter.defectTypeOriginal;
    delete processedFilter.defectiveSignboardRevised;
    delete processedFilter.dsrnToBeServed;
    delete processedFilter.dsrnNo;
    delete processedFilter.signboardOwnerNAddress;
    delete processedFilter.seniorPro;
    delete processedFilter.caseOfficer;
    delete processedFilter.caseAssistant;

    // delete processedFilter.surveyDateRange;

    return processedFilter;
}

export const searchSignboard = async ({searchString, accessToken}) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/signboards/filter?signboardIdRange=${JSON.stringify(searchString)}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return response;
    } catch(e) {
        return e.response.status;
    }
}

export const saveRecordSetting = async ({ settings, staffId, accessToken }) => {
    try {
        const response = await axios.post(
            `${ROOT_API}/user/${staffId}/filter`,
            JSON.stringify(settings),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    }
    catch (e){
        return e.response.status;
    }
}

export const exportImages = async (signboardIds, accessToken) => {
    try {
        const response = await axios.post(
            `${ROOT_API}/signboards/export`,
            JSON.stringify([...signboardIds]),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                responseType: "blob"
            }
        );

        return response;
    }
    catch (e) {
        return e.response.status;
    }
}

export const queryLocation  = async (accessToken, field, searchString) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/buildings/filter?field=${field}&searchString=${searchString}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    }
    catch(e) {
        return e.response.status;
    }
}

export const exportList = async (accessToken, {filter, sort, display}) => {
    let processedFilter = cleanFilter(filter, sort);

    try {
        const response = await axios.post(
            `${ROOT_API}/signboards/export-list`,
            JSON.stringify({ ...processedFilter, display }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                responseType: "text"
            }
        )

        return response;
    } catch(e) {
        return e.response.status;
    }
}

export const paginate = async ({ accessToken, page, filter }) => {
    
    try {
        const response = await axios.post(
            `${ROOT_API}/signboards/filter`,
            JSON.stringify({
                page,
                pageSize: 10,
                ...filter
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    
        return response;
    } catch(e) {
        return e.response.status;
    }
}

export const searchAddress = async (accessToken, keyword) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/buildings/filter?field=englishAddress&searchString=${keyword}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const searchFileRef = async (accessToken, keyword) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/buildings/filter?field=fileRef&searchString=${keyword}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const getPresets = async ({accessToken, userId}) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/user/${userId}/filter`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        
        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const deletePreset = async (accessToken, filterId, staffId) => {
    try {
        const response = await axios.delete(
            `${ROOT_API}/user/${staffId}/filter/${filterId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const updatePreset = async ({ settings, filterId, staffId, accessToken }) => {
    try {
        const response = await axios.patch(
            `${ROOT_API}/user/${staffId}/filter/${filterId}`,
            JSON.stringify(settings),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const getSurveys = async ({ accessToken }) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/surveys`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const queryAreaCode  = async (accessToken, searchString) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/buildings/filter?field=areaCode&searchString=${searchString}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    }
    catch(e) {
        return e.response.status;
    }
}

export const searchPeople = async ({accessToken, searchString, searchType}) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/signboards/filter?${searchType}="${searchString}"`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        
        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const searchDsrnNo = async ({ accessToken, searchString }) => {
    try {
      const response = await axios.get(
        `${ROOT_API}/signboards/filter?dsrnNo="${searchString}"`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response;
    } catch (e) {
      return e.response.status;
    }
}

export const signOwnerSearch = async ({ accessToken, searchString }) => {
    try {
      const response = await axios.get(
        `${ROOT_API}/signboards/filter?addressSignOwers="${searchString}"`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response;
    } catch (e) {
      return e.response.status;
    }
}