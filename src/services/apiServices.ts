import { OutcomeData } from './../redux/callState/asyncActionCreator';
import axios from 'axios';
import * as querystring from 'querystring';
import { ApiData, CountData, DonationGoal } from './../common/model';
import * as Constants from '../common/constants';

export const getAllIssues = (address: string): Promise<ApiData> => {
  return axios.get(`${Constants.ISSUES_API_URL}${encodeURIComponent(address)}`)
    .then(response => Promise.resolve(response.data))
    .catch(e => Promise.reject(e));
};

export const getCountData = (): Promise<CountData> => {
  return axios.get(`${Constants.COUNTS_API_URL}`)
    .then(response => Promise.resolve(response.data))
    .catch(e => Promise.reject(e));
};

export const postOutcomeData = (data: OutcomeData) => {
  const postData = querystring.stringify({
    location: data.location,
    result: data.outcome,
    contactid: data.contactId,
    issueid: data.issueId,
    via: data.via
  });
  // console.log('postOutcomeData() posted data:', postData)
  return axios.post(
      `${Constants.REPORT_API_URL}`,
      postData,
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
    .then(response => {
    // console.log('postOutcomeData() response: ', response.data);
    return Promise.resolve(null);
  })
    .catch(e => Promise.reject(e));
};

export const getDonations = (): Promise<DonationGoal> => {
  const donationUrl = 'https://pgb84kuy7a.execute-api.us-east-2.amazonaws.com/production/donations';
  return axios.get(`${donationUrl}`)
    .then(response => Promise.resolve(response.data))
    .catch(e => Promise.reject(e));
};
