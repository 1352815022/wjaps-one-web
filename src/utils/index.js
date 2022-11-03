import * as XLSX from 'xlsx';
import moment from 'moment';
import { message } from 'antd';
import { request } from 'suid/es/utils';
import constants from './constants';
import * as userUtils from './user';

const { SEARCH_DATE_PERIOD, PROJECT_PATH } = constants;
const startFormat = 'YYYY-MM-DD';
const endFormat = 'YYYY-MM-DD';
const exportXlsx = (fileTitle, cols, data) => {
  const header = [];
  cols.forEach(t => {
    header.push(t);
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([header]);
  XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A2' });
  ws['!cols'] = [];
  header.forEach(() => ws['!cols'].push({ wpx: 150 }));
  XLSX.utils.book_append_sheet(wb, ws, fileTitle);
  XLSX.writeFile(wb, `${fileTitle}.xlsx`);
};

const getTimeFilter = (fieldName, currentViewDate) => {
  const filters = [];
  const currentDate = moment();
  const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
  switch (searchDateType) {
    case SEARCH_DATE_PERIOD.THIS_MONTH.name:
      filters.push({
        fieldName,
        operator: 'GE',
        fieldType: 'date',
        value: currentDate.startOf('month').format(startFormat),
      });
      filters.push({
        fieldName,
        operator: 'LE',
        fieldType: 'date',
        value: currentDate.endOf('month').format(endFormat),
      });
      break;
    case SEARCH_DATE_PERIOD.THIS_WEEK.name:
      filters.push({
        fieldName,
        operator: 'GE',
        fieldType: 'date',
        value: currentDate.startOf('week').format(startFormat),
      });
      filters.push({
        fieldName,
        operator: 'LE',
        fieldType: 'date',
        value: currentDate.endOf('week').format(endFormat),
      });
      break;
    case SEARCH_DATE_PERIOD.TODAY.name:
      filters.push({
        fieldName,
        operator: 'GE',
        fieldType: 'date',
        value: currentDate.format(startFormat),
      });
      filters.push({
        fieldName,
        operator: 'LE',
        fieldType: 'date',
        value: currentDate.format(endFormat),
      });
      break;
    case SEARCH_DATE_PERIOD.PERIOD.name:
      filters.push({
        fieldName,
        operator: 'GE',
        fieldType: 'date',
        value: moment(startTime).format(startFormat),
      });
      filters.push({
        fieldName,
        operator: 'LE',
        fieldType: 'date',
        value: moment(endTime).format(endFormat),
      });
      break;
    default:
      break;
  }
  return filters;
};

const getRangeDate = currentViewDate => {
  const currentDate = moment();
  const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
  let dateRange = {};
  switch (searchDateType) {
    case SEARCH_DATE_PERIOD.THIS_MONTH.name:
      dateRange = {
        effectiveFrom: currentDate.startOf('month').format(startFormat),
        effectiveTo: currentDate.endOf('month').format(endFormat),
      };
      break;
    case SEARCH_DATE_PERIOD.THIS_WEEK.name:
      dateRange = {
        effectiveFrom: currentDate.startOf('week').format(startFormat),
        effectiveTo: currentDate.endOf('week').format(endFormat),
      };
      break;
    case SEARCH_DATE_PERIOD.TODAY.name:
      dateRange = {
        effectiveFrom: currentDate.format(startFormat),
        effectiveTo: currentDate.format(startFormat),
      };
      break;
    case SEARCH_DATE_PERIOD.PERIOD.name:
      dateRange = {
        effectiveFrom: moment(startTime).format(startFormat),
        effectiveTo: moment(endTime).format(endFormat),
      };
      break;
    default:
      dateRange = {};
      break;
  }
  return dateRange;
};

/**
 * 后端导出excel
 */
const exportHandle = (uri, requestData, fieldName) => {
  request.post(`${PROJECT_PATH}${uri}`, requestData, { responseType: 'blob' }).then(res => {
    const { success, data, message: msg } = res;
    if (success) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `${fieldName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } else {
      message.error(msg);
    }
  });
};

const downFile = (blob, fileName) => {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }, 50);
  }
};

export { constants, userUtils, exportXlsx, getTimeFilter, getRangeDate, exportHandle, downFile };
