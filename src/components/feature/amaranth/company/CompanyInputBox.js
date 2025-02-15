import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Row, Col } from 'react-bootstrap';
import { ButtonW, TextFieldBox } from '../../../common/Index';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';
import './CompanyInputBox.css';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { getNowJoinTime } from '../../../../util/time';
import ComModel from './model/ComModel';

import { Label } from '../../../../../node_modules/@mui/icons-material/index';
import { ko } from 'date-fns/esm/locale';

import SubmitButton from './button/SubmitButton';
import EditButton from './button/EditButton';
import { clear } from '../../../../../node_modules/@testing-library/user-event/dist/clear';
import { authAxiosInstance } from '../../../../axios/axiosInstance';
import Swal from 'sweetalert2';
import EventButton from '../../../common/button/EventButton';
import CompanyNameSelect from './companyName/CompanyNameSelect';

const CompanyInputBox = ({
  formData,
  formDataSet,
  insertCheck,
  setInsertCheck,
  ch_listData,
  ch_listDataSet,
  saveBtn,
  editBtn,
  removeBtn,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setFocus,
    trigger,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm({ mode: 'onChange', shouldFocusError: true });

  const labels = {
    PIC_FILE_ID: 'PIC_FILE_ID',
    CO_CD: 'CO_CD',
    USE_YN: 'USE_YN',
    CO_NM: 'CO_NM',
    CO_NMK: 'CO_NMK',
    BUSINESS: 'BUSINESS',
    JONGMOK: 'JONGMOK',
    REG_NB: 'REG_NB',
    CEO_NM: 'CEO_NM',
    HO_FAX: 'HO_FAX',
    CEO_TEL: 'CEO_TEL',
    PPL_NB: 'PPL_NB',
    HO_ZIP: 'HO_ZIP',
    HO_ADDR: 'HO_ADDR',
    HO_ADDR1: 'HO_ADDR1',
    CO_FG: 'CO_FG',
    CO_NB: 'CO_NB',
    EST_DT: 'EST_DT',
    OPEN_DT: 'OPEN_DT',
    CLOSE_DT: 'CLOSE_DT',
    ACCT_FG: 'ACCT_FG',
  };

  const regexPatterns = {
    CO_CD: [/^\d{4}$/, '4자리 숫자로 입력하세요'],
    CO_NM: [/^.{1,30}$/, '회사명이 너무 깁니다.'],
    CO_NMK: [/^.{1,10}$/, '10자리 이내로 입력하세요'],
    BUSINESS: [/^.{1,10}$/, '10자리 이내로 입력하세요'],
    JONGMOK: [/^.{1,10}$/, '10자리 이내로 입력하세요'],
    REG_NB: [/^\d{3}-\d{2}-\d{5}$/, '형식에 맞춰서 입력하세요'],
    CEO_NM: [/^[가-힣A-Za-z]{2,10}$/, '2~10자리 이내로 입력하세요'],
    HO_FAX: [/^\d{3}-\d{3}-\d{4}$/, '형식에 맞춰 입력하세요'],
    CEO_TEL: [/^0\d{2}-\d{3,4}-\d{4}$/, '전화번호 형식에 맞게 입력하세요'],
    PPL_NB: [
      /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])-\d{7}$/,
      '주민번호 형식에 맞게 입력하세요',
    ],
    HO_ZIP: [/^\d{5}$/, '우편번호 형식에 맞게 입력하세요'],
    HO_ADDR: [/[가-힣]+/, '잘못된 주소지 입니다'],
    CO_NB: [/^\d{6}-\d{7}$/, '형식에 맞게 입력하세요'],
    required: '필수 입력입니다',
    dup: '이미 존재합니다',
  };

  const ACCT_FG_OP = [
    '일반 의료기관',
    '일반비영리',
    '학교(교비)',
    '산학협력단',
  ];
  const [dupError, setDupError] = useState({
    CO_CD: false,
    CEO_TEL: false,
    PPL_NB: false,
    REG_NB: false,
  });
  const pplBackNumberError = useRef(false);
  const CO_FG_OP = ['개인', '법인'];
  const dupColmn = ['CO_CD', 'CEO_TEL', 'PPL_NB', 'REG_NB'];
  const transformColme = ['REG_NB', 'HO_FAX', 'PPL_NB', 'CO_NB', 'CEO_TEL'];
  const [selectedImage, setSelectedImage] = useState();
  const [ch_formData, setChFormData] = useState({});
  const up_FormData = useRef(); //{ EST_DT: "", OPEN_DT: "", CLOSE_DT: "" }

  const [selectedDate, setSelectedDate] = useState();
  const [isOpenPost, setIsOpenPost] = useState(false); // 우편번호 모달창
  const [isOpenCompanyName, setIsOpenCompanyName] = useState(false); // 우편번호 모달창
  const [uppercaseFormData, setUppercaseFormData] = useState({});
  const companyCodeInput = useRef();

  React.useEffect(() => {
    if (formData) {
      console.log(
        '마운틴',
        formData,
        '서버',
        formData.pic_FILE_ID,
        '아닌',
        formData.PIC_FILE_ID,
        formData?.pic_FILE_ID?.includes('data:image'),
        formData?.PIC_FILE_ID?.includes('data:image')
      );

      // if (formData?.pic_FILE_ID) {
      //   console.log('타냐?(서버(');
      //   setSelectedImage(formData.pic_FILE_ID);
      // }
      // if (formData?.PIC_FILE_ID) {
      //   console.log('타냐?(아닌(');
      //   setSelectedImage(formData.PIC_FILE_ID);
      // }

      setChFormData();
      console.log(
        '검사마운트',
        ch_formData,
        Object.keys(formData).length,
        formData?.co_CD,
        formData?.co_CD !== '' && formData
      );
      setChFormData(prevChFormData => ({
        ...prevChFormData,
        CO_CD: formData.co_CD ? formData.co_CD : formData.CO_CD,
      }));
      console.log('??????????', ch_formData);

      for (const key in formData) {
        const uppercaseKey = key.toUpperCase();
        up_FormData[uppercaseKey] = formData[key]; //hyphenation(uppercaseKey, formData[key]);
        if (transformColme.includes(uppercaseKey)) {
          hyphenation(up_FormData[uppercaseKey], uppercaseKey);
        } else if (!transformColme.includes(uppercaseKey)) {
          setValue(uppercaseKey, up_FormData[uppercaseKey]);
          if (uppercaseKey === 'PIC_FILE_ID') {
            setSelectedImage(up_FormData.PIC_FILE_ID);
          }
        }
      }

      console.log('qudrud', up_FormData);
      console.log('에러', dupError);

      setSelectedDate(getValues()); //
      setInsertCheck();
      clearErrors();
    }
  }, [formData]);

  // const asyncRequest = async (url, methodType, data, headers) => {
  //   console.log(data);
  //   const cookies = document.cookie;
  //   const token = cookies.split('=')[1];
  //   try {
  //     const response = await axios({
  //       method: methodType,
  //       url: url,
  //       data: data,
  //       withCredentials: true,

  //       headers: { Authorization: token, ...headers },
  //     });

  //     console.log('가져온 값', response.data);
  //     return response;
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // };

  const onFocusErrors = e => {
    console.log('------------------------------------');
    console.log(errors[0]?.message);
    console.log(errors[e.target.name]);
    console.log(Object.keys(errors).length);
    console.log(errors[e.target.name]?.message);

    //아무것도 입력되지 않는 상태에서
    if (Object.keys(errors).length >= 0) {
      Object.keys(errors).forEach(errorFieldName => {
        const fieldName = e.target.name;
        console.log('확인!!', errorFieldName, fieldName);
        if (errorFieldName !== fieldName) {
          clearErrors(errorFieldName);
        }
      });
    }

    if (
      !dupError[e.target.name] &&
      !regexPatterns[e.target.name][0].test(e.target.value)
    ) {
      console.log('검사확인');
      setError(e.target.name, {
        message:
          e.target.value && !e.target.value.includes('__')
            ? regexPatterns[e.target.name][1]
            : regexPatterns.required,
      });
    } else if (
      dupError[e.target.name] &&
      dupError.hasOwnProperty(e.target.name)
    ) {
      setError(e.target.name, {
        message: regexPatterns.dup,
      });
    }
  };
  const onEnterKeyDown = e => {
    console.log('엔터키!!!!!!!!!!!', e.target.name);
    if (
      e.key === 'Enter' &&
      e.target.name !== '' &&
      e.target.name !== undefined &&
      !regexPatterns[e.target.name][0].test(e.target.value)
    ) {
      clearErrors();
      setError(
        e.target.name,
        {
          message: e.target.value
            ? regexPatterns[e.target.name][1]
            : regexPatterns.required,
        } // 에러 메세지
      );
      e.preventDefault();
    }
  };

  const onBlurClearErrors = e => {
    if (!errors['DUP_PPL_NB']) {
      clearErrors();
    }
  };

  //이미지 데이터 인코딩
  //base64 = 이미지URL을 문자형으로
  //Blob = base64를 정수형 베열형태 => 원시 데이터로
  const blobToByteArray = blob => {
    return new Promise((resolve, reject) => {
      if (!(blob instanceof Blob)) {
        reject();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        console.log('로그');
        const base64Data = reader.result;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDateChange = (key, date) => {
    if (ch_formData.CO_CD !== '') {
      setChFormData(prevChFormData => ({
        ...prevChFormData,
        [key]: date,
      }));
    }

    setSelectedDate(prevState => ({
      ...prevState,
      [key]: date,
    }));
    console.log(selectedDate);
  };

  // 회사명 검색
  const onChangeOpenCompanyName = () => {
    console.log(!isOpenCompanyName);
    setIsOpenCompanyName(!isOpenCompanyName);
  };
  // 회사명 검색 시 처리
  const onCompleteCompanyName = searckCompanyData => {
    console.log('모달', searckCompanyData);
    console.log('번호', searckCompanyData.bno, searckCompanyData.cno);
    setIsOpenPost(false);
    const fieldUpdates = [
      { name: labels.CO_NM, value: searckCompanyData.company },
      { name: labels.REG_NB, value: searckCompanyData.bno },
      { name: labels.CO_NB, value: searckCompanyData.cno },
    ];

    fieldUpdates.forEach(field => {
      setValue(field.name, field.value);
      onChangeInput({ target: { name: field.name, value: field.value } });
    });
    setValue('CO_FG', '법인');
  };
  const handleOverlayClick = e => {
    e.stopPropagation(); // 이벤트 전파 중단ChFormData
  };
  // 우편번호 검색 시 처리
  const onCompletePost = data => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setValue(labels.HO_ZIP, data.zonecode);
    setValue(labels.HO_ADDR, fullAddr);
    onChangeInput({ target: { name: labels.HO_ZIP, value: data.zonecode } });
    onChangeInput({ target: { name: labels.HO_ADDR, value: fullAddr } });
    setIsOpenPost(false);
  };
  const onChangeOpenPost = () => {
    console.log(isOpenPost);
    setIsOpenPost(!isOpenPost);
  };

  const handleImageChange = async e => {
    console.log('이미지!!!!!!!!!!!!');
    setSelectedImage();

    const imageFile = await blobToByteArray(e.target.files[0]);
    if (imageFile) {
      setSelectedImage(imageFile); // 선택한 이미지 파일의 URL로 업데이트
      onChangeInput({ target: { name: labels.PIC_FILE_ID, value: imageFile } });
    }
  };
  const handleImageRemove = () => {
    setSelectedImage('');
    setValue('PIC_FILE_ID', '');
    setChFormData(prevChFormData => ({
      ...prevChFormData,
      PIC_FILE_ID: 'none',
    }));
  };

  const onSubmit = async (empdata, e) => {
    console.log(empdata);
    console.log(selectedImage);
    console.log('에러', dupError, hasValue(dupError));

    if (formData.co_CD === '' && getValues() !== '' && hasValue(dupError)) {
      try {
        const n_formData = new FormData();
        for (const key in empdata) {
          if (transformColme.includes(key)) {
            empdata[key] = empdata[key].replace(/-/g, ''); // 하이픈 제거
            n_formData.append(key, empdata[key]);
          } else if (!transformColme.includes(key)) {
            n_formData.append(key, empdata[key]);
          }
        }

        if (selectedImage) {
          const imageByteArray = selectedImage;
          console.log('이미지', imageByteArray);
          empdata.PIC_FILE_ID = imageByteArray;
          n_formData.append('PIC_FILE_ID', imageByteArray);
        }

        console.log('전달데이터', n_formData);
        for (let pair of n_formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await authAxiosInstance.post(
          'system/admin/groupManage/CompanyInsert',
          n_formData,
          { 'Content-Type': 'multipart/form-data' } // 이부분 코드 확인하기
        );
        if (response.data !== '') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '회사 정보가 성공적으로 추가되었습니다.',
            showConfirmButton: false,
            timer: 1200,
          });
          console.log('인풋', empdata);
          //companyCodeInput.current.readOnly = true;
        }
        ch_listDataSet(0);
        setInsertCheck(true);
        formDataSet();
        formDataSet(prevFormData => ({
          ...prevFormData,
          ...empdata,
        }));
        // formDataSet(prevFormData => ({
        //   ...prevFormData,
        //   ...n_formData,
        // }));
        console.log('전달된:', response.data);
      } catch (error) {
        console.error('데이터 전송 실패:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '회사 정보 추가에 실패했습니다.',
          showConfirmButton: false,
          timer: 1200,
        });
      }
    } else {
      for (const key in dupError) {
        if (dupError[key]) {
          console.log(key);
          setError(key, { message: regexPatterns.dup }, { shouldFocus: true });
        }
      }
    }
  };

  const hasValue = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 객체 자체의 프로퍼티인지 확인
        const value = obj[key];

        if (value) {
          console.log('★★★★★', value);
          return false; // 문자열 값 중에서 substring을 포함하는 경우
        }
      }
    }
    return true;
  };

  const onChangeInput = async e => {
    const dup = { [e.target.name]: e.target.value };
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    const parts = fieldName.split('_'); // "_"를 기준으로 문자열을 나눕니다.
    const transformedString = parts[0].toLowerCase() + '_' + parts[1]; // 첫 번째 부분은 소문자로 변환하고, 두 번째 부분은 소문자로 변환한 후 다시 "_"와 합칩니다.
    const checkFormData = getValues();
    checkFormData.PIC_FILE_ID =
      checkFormData.PIC_FILE_ID !== selectedImage
        ? selectedImage
        : checkFormData.PIC_FILE_ID;
    for (const key in checkFormData) {
      if (transformColme.includes(key)) {
        checkFormData[key] = checkFormData[key].replace(/[-_]/g, ''); // 하이픈과 밑줄 모두 제거
      }
    }
    if (updateCheckObjects(checkFormData, up_FormData)) {
      ch_listDataSet(0);
    } else {
      ch_listDataSet(prveData => prveData + 1);
    }

    console.log(transformedString); // "co_CD"
    console.log('타냐?', Object.keys(errors).length);
    console.log('라벨', getValues(e.target.name), 'dup', dup[e.target.name]);

    console.log(errors);
    console.log(errors[e.target.name]?.message);
    console.log(regexPatterns[e.target.name]);
    console.log(
      '현재',
      dup[e.target.name].length,
      '과거',
      ch_formData[e.target.name]?.length
    );
    console.log('row:', e.target.rawValue, '그냥:', e.target.Value);

    // console.log(
    //   '검사',
    //   regexPatterns[e.target.name][0].test(dup[e.target.name]),
    //   '에러 유무',
    //   errors[e.target.name],
    //   '해당 유무',
    //   dupColmn.includes(e.target.name)
    // );
    // //clearErrors(e.target.name);
    // if (prevData.count === 0) {
    //   console.log('타냐?');
    // }
    if (
      //Object.keys(errors).length <= 1 &&
      //errors[e.target.name] === undefined &&
      //regexPatterns[e.target.name][0] !== undefined &&
      dup[e.target.name] !== '' &&
      dup[e.target.name] !== formData[transformedString] &&
      dupColmn.includes(e.target.name) &&
      regexPatterns[e.target.name][0].test(dup[e.target.name])
    ) {
      console.log('주민인증', etIsRegistFieldRight(dup[e.target.name]));
      if (
        e.target.name === 'PPL_NB' &&
        !etIsRegistFieldRight(dup[e.target.name])
      ) {
        console.log(
          '주민번호!!!!:',
          dup[e.target.name],
          regexPatterns[e.target.name][1],
          e.target.name,
          errors[e.target.name]
        );
        console.log('★★★★★', errors[e.target.name]);
        setError(
          'DUP_PPL_NB',
          { message: regexPatterns[e.target.name][1] },
          { shouldFocus: true }
        );
        return;
      } else {
        clearErrors('DUP_PPL_NB');
      }
      dup[e.target.name] = dup[e.target.name].replace(/-/g, '');

      try {
        const formData = new FormData();
        formData.append(e.target.name, dup[e.target.name]);

        const response = await authAxiosInstance.post(
          'system/admin/groupManage/CompanyDup',
          formData,
          { 'Content-Type': 'multipart/form-data' }
        );

        if (response.data !== '') {
          setError(
            e.target.name,
            { message: regexPatterns.dup }, // 에러 메세지
            { shouldFocus: true }
          );
          setDupError(privDupError => ({
            ...privDupError,
            [e.target.name]: true,
          }));
        } else if (response.data === '') {
          setDupError(privDupError => ({
            ...privDupError,
            [e.target.name]: false,
          }));
        }
      } catch (error) {
        console.error('데이터 전송 실패:', error);
      }
    } else if (
      dup[e.target.name] !== '' &&
      dup[e.target.name] !== formData[transformedString] &&
      transformColme.includes(e.target.name) &&
      !regexPatterns[e.target.name][0].test(dup[e.target.name]) &&
      dup[e.target.name].length >= ch_formData[e.target.name]?.length
    ) {
      hyphenation(dup[e.target.name], e.target.name);
    }

    const undefinedCheck =
      dup.PIC_FILE_ID === undefined && formData.pic_FILE_ID === undefined;
    if (
      (ch_formData.CO_CD !== '' && dup.PIC_FILE_ID !== formData.pic_FILE_ID) ||
      undefinedCheck
    ) {
      setChFormData(prevChFormData => ({
        ...prevChFormData,
        [fieldName]: fieldValue,
      }));
    } else if (transformColme.includes(e.target.name)) {
      setChFormData(prevChFormData => ({
        ...prevChFormData,
        [fieldName]: fieldValue,
      }));
    }
    console.log('변경이벤트!!!!', ch_formData);
  };

  const etIsRegistFieldRight = registNum => {
    const TODAY_YEAR = parseInt(new Date().getFullYear().toString().substr(-2));

    if (registNum.length !== 14)
      // 대시 있는 경우 14로 변경
      return false;

    // 연도에 해당하는 숫자와 성별에 해당하는 숫자 비교
    const yearNum = registNum.slice(0, 2);
    const sexNum = registNum.slice(7, 8); // 대시 있는 경우 7로 변경
    console.log(
      yearNum,
      sexNum,
      TODAY_YEAR,
      yearNum < TODAY_YEAR,
      yearNum > TODAY_YEAR
    );
    if (sexNum === '1' || sexNum === '2') {
      if (yearNum < TODAY_YEAR) {
        return false;
      }
    } else if (sexNum === '3' || sexNum === '4') {
      if (yearNum > TODAY_YEAR) return false;
    } else return false;

    return true;
  };
  const hyphenation = (inputData, type) => {
    const transformPattern = {
      REG_NB: /(\d{3})(?:-?)(\d{0,2})(?:-?)(\d{0,5})/, // 000-00-00000
      HO_FAX: /(\d{3})(?:-?)(\d{0,3})(?:-?)(\d{0,4})/, // 000-0000-000
      CO_NB: /(\d{6})(?:-?)(\d{0,7})/, // 000000-0000000
      PPL_NB: /(\d{6})(?:-?)(\d{0,7})/, // 000000-0000000
      CEO_TEL: /(\d{3})(?:-?)(\d{0,4})(?:-?)(\d{0,4})/, // 000-0000-0000
    };

    const match = inputData.match(transformPattern[type]); // 정규식으로 그룹화
    //console.log('변환 타냐?>', inputData, type, match, match === '');
    if (match) {
      const formattedNumber = [match[1], match[2], match[3]]
        .filter(Boolean)
        .join('-');

      setValue(type, formattedNumber);
    } else if (inputData === '') {
      setValue(type, '');
    }
  };
  const updateCheckObjects = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    delete keys2['0'];
    console.log('변경(함수)', keys1, keys2);

    // 두 객체의 프로퍼티 키 목록을 순회하며 값을 비교합니다.
    for (const key of keys1) {
      // 'current' 키는 건너뛰고 나머지 키만을 비교합니다.
      if (key === 'current') {
        continue;
      }
      console.log(
        '변경(확인)',
        key,
        '1',
        obj1[key],
        '2',
        obj2[key],
        obj1[key] !== obj2[key]
      );
      // 두 객체의 같은 키에 대한 값을 비교합니다.checkFormData
      if (obj1[key] !== obj2[key]) {
        console.log('변경(틀림)', obj1[key], obj2[key]);
        return false; // 값이 다르면 다른 데이터를 가지고 있다고 판단합니다.
      }
    }

    // 모든 프로퍼티가 같으면 같은 데이터를 가지고 있다고 판단합니다.
    return true;
  };

  const updateBtnClick = async () => {
    const checkFormData = getValues();
    checkFormData.PIC_FILE_ID =
      checkFormData.PIC_FILE_ID !== selectedImage
        ? selectedImage
        : checkFormData.PIC_FILE_ID;
    for (const key in checkFormData) {
      if (transformColme.includes(key)) {
        checkFormData[key] = checkFormData[key].replace(/-/g, ''); // 하이픈 제거
      }
    }
    const dataCheck = updateCheckObjects(checkFormData, up_FormData);

    console.log(
      '변경!!!!!!!!!!!!',
      ch_formData,
      'ㄴㅇㄴㅇㄹㄴㅇㄹ',
      formData,
      'ㄴㅇㄴㅇㄹㄴㅇㄹ',
      getValues(),
      'ㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹ',
      checkFormData,
      up_FormData,
      selectedImage,
      dataCheck
    );
    const isValid = await trigger();
    if (!dataCheck) {
      if (ch_formData.CO_CD !== '' && isValid && hasValue(dupError)) {
        const c_formData = new FormData();

        for (const key in ch_formData) {
          if (transformColme.includes(key)) {
            ch_formData[key] = ch_formData[key].replace(/-/g, ''); // 하이픈 제거
            c_formData.append(key, ch_formData[key]);
          } else if (!transformColme.includes(key)) {
            c_formData.append(key, ch_formData[key]);
          }
        }

        try {
          const response = await authAxiosInstance.put(
            'system/admin/groupManage/CompanyUpdate',
            c_formData,
            { 'Content-Type': 'multipart/form-data' }
          );
          console.log(response.data);
          ch_listDataSet(0);
          if (response.data !== '') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '회사 정보가 성공적으로 수정되었습니다.',
              showConfirmButton: false,
              timer: 1200,
            });
          }
          formDataSet(prevFormData => ({
            ...prevFormData,
            ...checkFormData,
          }));
        } catch (error) {
          console.log(error);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '회사 정보 수정에 실패했습니다.',
            showConfirmButton: false,
            timer: 1200,
          });
        }
        console.log('변경!!!!!!!!!!!?', ch_formData);
      } else {
        for (const key in dupError) {
          if (dupError[key]) {
            console.log(key);
            setError(
              key,
              { message: regexPatterns.dup },
              { shouldFocus: true }
            );
          }
        }
      }
    } else {
      console.log('수정여부 확인@!!!!!');
      ch_listDataSet(0);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '회사정보 수정된 정보가 없습니다.',
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const removeBtnClick = async () => {
    const CO_CD = formData.co_CD;
    console.log('삭제', formData.use_YN);
    if (formData.use_YN !== '0') {
      try {
        const response = await authAxiosInstance.put(
          'system/admin/groupManage/CompanyRemove/' + CO_CD,
          'put'
        );
        if (response.data !== '') {
          ch_listDataSet(prveData => prveData + 1);
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '회사 정보가 성공적으로 삭제되었습니다.',
          showConfirmButton: false,
          timer: 1200,
        });
        ch_listDataSet(0);
        console.log('삭제검사', getValues());
      } catch (error) {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '회사 정보 삭제에 실패했습니다.',
          showConfirmButton: false,
          timer: 1200,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '이미 삭제된 회사 정보입니다.',
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const E_selectedDateValue =
    selectedDate && selectedDate[labels.EST_DT]
      ? new Date(selectedDate[labels.EST_DT])
      : null;
  const O_selectedDateValue =
    selectedDate && selectedDate[labels.OPEN_DT]
      ? new Date(selectedDate[labels.OPEN_DT])
      : null;
  const C_selectedDateValue =
    selectedDate && selectedDate[labels.CLOSE_DT]
      ? new Date(selectedDate[labels.CLOSE_DT])
      : null;

  return (
    <div className="company-form">
      <form
        onChange={onChangeInput}
        onSubmit={handleSubmit(onSubmit)}
        onBlur={onBlurClearErrors}
        onKeyDown={onEnterKeyDown}
      >
        <div className="button-container">
          {formData?.co_CD !== '' && formData ? (
            <div>
              <button
                ref={editBtn}
                style={{ display: 'none' }}
                onClick={() => {
                  trigger(); // 유효성 검사를 실행한 후 onSubmit 호출 (수정하기)
                  handleSubmit(updateBtnClick());
                }}
              >
                저장
              </button>
            </div>
          ) : (
            <div>
              <button type="submit" ref={saveBtn} style={{ display: 'none' }}>
                저장
              </button>
            </div>
          )}
          <button
            ref={removeBtn}
            style={{ display: 'none' }}
            onClick={() => removeBtnClick()}
          >
            삭제
          </button>
        </div>

        <table className="tableStyle">
          <tbody>
            <tr>
              <th className="headerCellStyle">회사로고</th>
              <td colSpan="3" className="cellStyle">
                <div className="userAvaterWrapper">
                  <div className="userAvater">
                    <input
                      type="file"
                      id="fileImageUpload"
                      accept="image/*"
                      className="userImage"
                      name={labels.PIC_FILE_ID}
                      onChange={handleImageChange}
                    />
                    <div className="userImageLabel">
                      {selectedImage ? (
                        <img src={selectedImage} alt="Company Logo" />
                      ) : (
                        <img
                          src="https://cdn.logo.com/hotlink-ok/logo-social.png"
                          alt="Default Company Logo"
                        />
                      )}
                    </div>
                    <label
                      id="imageButtonWrapper"
                      className="imageButtonWrapper"
                      htmlFor="fileImageUpload"
                      // onClick={userImgSubmit}
                    >
                      <i className="fa-solid fa-paperclip"></i>
                    </label>

                    {selectedImage && (
                      <button
                        type="button"
                        className="comimageButtonWrapper2"
                        onClick={handleImageRemove}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">회사코드</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  {up_FormData.CO_CD ? (
                    <input
                      type="text"
                      name={labels.CO_CD}
                      className="companyReqInputStyle"
                      readOnly
                      style={{ backgroundColor: '#f2f2f2' }}
                      {...register(labels.CO_CD, {
                        pattern: {
                          value: regexPatterns.CO_CD[0],
                          message: regexPatterns.CO_CD[1],
                        },
                        required: regexPatterns.required,
                      })}
                    />
                  ) : (
                    <input
                      type="text"
                      ref={companyCodeInput}
                      name={labels.CO_CD}
                      maxLength="4"
                      className="companyReqInputStyle"
                      {...register(labels.CO_CD, {
                        pattern: {
                          value: regexPatterns.CO_CD[0],
                          message: regexPatterns.CO_CD[1],
                        },
                        required: regexPatterns.required,
                      })}
                      onFocus={onFocusErrors}
                    />
                  )}
                  {errors[labels.CO_CD] && (
                    <p className="comerrorBox">{errors?.CO_CD?.message}</p>
                  )}
                </div>
              </td>
              <th className="headerCellStyle">사용여부</th>
              <td className="cellStyle">
                사용
                <input
                  type="radio"
                  className="comRadioStyle"
                  value="1"
                  {...register(labels.USE_YN)}
                />
                미사용
                <input
                  type="radio"
                  className="comRadioStyle"
                  value="0"
                  {...register(labels.USE_YN)}
                />
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">회사명</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.CO_NM}
                    maxLength="17"
                    className="C_companyNameInputStyle"
                    {...register(labels.CO_NM, {
                      pattern: {
                        value: regexPatterns.CO_NM[0],
                        message: regexPatterns.CO_NM[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />
                  {errors[labels.CO_NM] && (
                    <p className="comerrorBox">{errors?.CO_NM?.message}</p>
                  )}

                  <button
                    className="companyFFcustomButton"
                    onClick={onChangeOpenCompanyName}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </td>
              <th className="headerCellStyle">회사약칭</th>
              <td colSpan="3" className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.CO_NMK}
                    maxLength="10"
                    className="inputStyle"
                    {...register(labels.CO_NMK, {
                      pattern: {
                        value: regexPatterns.CO_NMK[0],
                        message: regexPatterns.CO_NMK[1],
                      },
                    })}
                  />
                  {errors[labels.CO_NMK] && (
                    <p className="comerrorBox">{errors?.CO_NMK?.message}</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">사업자번호</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <InputMask
                    mask="999-99-99999"
                    alwaysShowMask={true}
                    {...register(labels.REG_NB, {
                      pattern: {
                        value: regexPatterns.REG_NB[0],
                        message: regexPatterns.REG_NB[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  >
                    {() => (
                      <input
                        type="text"
                        name={labels.REG_NB}
                        maxLength="13"
                        className="companyReqInputStyle"
                      />
                    )}
                  </InputMask>
                  {errors[labels.REG_NB] && (
                    <p className="comerrorBox">{errors?.REG_NB?.message}</p>
                  )}
                </div>
              </td>
              <th className="headerCellStyle">법인번호</th>
              <td className="cellStyle">
                <div className="inline-input-group">
                  <select
                    className="S_margin"
                    name={labels.CO_FG}
                    {...register(labels.CO_FG)}
                  >
                    {CO_FG_OP.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="errorWrapper">
                    <InputMask
                      mask="999999-9999999"
                      alwaysShowMask={true}
                      {...register(labels.CO_NB, {
                        pattern: {
                          value: regexPatterns.CO_NB[0],
                          message: regexPatterns.CO_NB[1],
                        },
                        required: regexPatterns.required,
                      })}
                      onFocus={onFocusErrors}
                    >
                      {() => (
                        <input
                          type="text"
                          name={labels.CO_NB}
                          maxLength="15"
                          className="companyReqInputStyle"
                        />
                      )}
                    </InputMask>
                    {errors[labels.CO_NB] && (
                      <p className="comerrorBox">{errors?.CO_NB?.message}</p>
                    )}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">업태</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.BUSINESS}
                    maxLength="10"
                    className="companyReqInputStyle"
                    {...register(labels.BUSINESS, {
                      pattern: {
                        value: regexPatterns.BUSINESS[0],
                        message: regexPatterns.BUSINESS[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />
                  {errors[labels.BUSINESS] && (
                    <p className="comerrorBox">{errors?.BUSINESS?.message}</p>
                  )}
                </div>
              </td>
              <th className="headerCellStyle">종목</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.JONGMOK}
                    maxLength="10"
                    className="companyReqInputStyle"
                    {...register(labels.JONGMOK, {
                      pattern: {
                        value: regexPatterns.JONGMOK[0],
                        message: regexPatterns.JONGMOK[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />

                  {errors[labels.JONGMOK] && (
                    <p className="comerrorBox">{errors?.JONGMOK?.message}</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">대표자명</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.CEO_NM}
                    maxLength="9"
                    className="companyReqInputStyle"
                    {...register(labels.CEO_NM, {
                      pattern: {
                        value: regexPatterns.CEO_NM[0],
                        message: regexPatterns.CEO_NM[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />
                  {errors[labels.CEO_NM] && (
                    <p className="comerrorBox">{errors?.CEO_NM?.message}</p>
                  )}
                </div>
              </td>
              <th className="headerCellStyle">대표전화</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.CEO_TEL}
                    maxLength="13"
                    className="companyReqInputStyle"
                    {...register(labels.CEO_TEL, {
                      pattern: {
                        value: regexPatterns.CEO_TEL[0],
                        message: regexPatterns.CEO_TEL[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />
                  {errors[labels.CEO_TEL] && (
                    <p className="comerrorBox">{errors?.CEO_TEL?.message}</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">대표주민번호</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <InputMask
                    mask="999999-9******"
                    alwaysShowMask={true}
                    onFocus={onFocusErrors}
                    {...register(labels.PPL_NB, {
                      pattern: {
                        value: regexPatterns.PPL_NB[0],
                        message: regexPatterns.PPL_NB[1],
                      },
                      required: regexPatterns.required,
                    })}
                  >
                    {() => (
                      <input
                        type="text"
                        name={labels.PPL_NB}
                        maxLength="15"
                        className="companyReqInputStyle"
                      />
                    )}
                  </InputMask>
                  {errors[labels.PPL_NB] && (
                    <p className="comerrorBox">{errors?.PPL_NB?.message}</p>
                  )}
                  {errors['DUP_PPL_NB'] && (
                    <p className="comerrorBox">{errors?.DUP_PPL_NB?.message}</p>
                  )}
                </div>
              </td>
              <th className="headerCellStyle">대표팩스</th>
              <td className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    name={labels.HO_FAX}
                    maxLength="12"
                    className="inputStyle"
                    {...register(labels.HO_FAX, {
                      pattern: {
                        value: regexPatterns.HO_FAX[0],
                        message: regexPatterns.HO_FAX[1],
                      },
                    })}
                  />
                  {errors['HO_FAX'] && (
                    <p className="comerrorBox">{errors?.HO_FAX?.message}</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">설립일</th>
              <td className="cellStyle">
                <DatePicker
                  selected={E_selectedDateValue}
                  onChange={date => {
                    handleDateChange(labels.EST_DT, getNowJoinTime(date));
                    setValue(labels.EST_DT, getNowJoinTime(date));
                  }}
                  dateFormat="yyyy-MM-dd"
                  calendarIcon={<i className="fa fa-calendar" />} // 달력 아이콘 설정
                  className="C_datePickerReqInputStyle"
                  onKeyDown={e => e.preventDefault()}
                  locale={ko}
                />
              </td>
              <th className="headerCellStyle">개/폐업일</th>
              <td className="cellStyle">
                <div className="inline-input-group">
                  <DatePicker
                    selected={O_selectedDateValue}
                    onChange={date => {
                      handleDateChange(labels.OPEN_DT, getNowJoinTime(date));
                      setValue(labels.OPEN_DT, getNowJoinTime(date));
                    }}
                    dateFormat="yyyy-MM-dd"
                    calendarIcon={<i className="fa fa-calendar" />} // 달력 아이콘 설정
                    className="C_datePickerInputStyle"
                    onKeyDown={e => e.preventDefault()}
                    locale={ko}
                  />
                  <p className="p_margin">/</p>
                  <DatePicker
                    selected={C_selectedDateValue}
                    onChange={date => {
                      handleDateChange(labels.CLOSE_DT, getNowJoinTime(date));
                      setValue(labels.CLOSE_DT, getNowJoinTime(date));
                    }}
                    dateFormat="yyyy-MM-dd"
                    calendarIcon={<i className="fa fa-calendar" />} // 달력 아이콘 설정
                    className="C_datePickerInputStyle"
                    onKeyDown={e => e.preventDefault()}
                    locale={ko}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle" rowSpan="2">
                주소
              </th>
              <td colSpan="3" className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    className="C_addressInputStyle"
                    maxLength="5"
                    {...register(labels.HO_ZIP, {
                      pattern: {
                        value: regexPatterns.HO_ZIP[0],
                        message: regexPatterns.HO_ZIP[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />

                  <ButtonW
                    data={'우편번호'}
                    onClickEvent={() => onChangeOpenPost()}
                  ></ButtonW>

                  {errors[labels.HO_ZIP] && (
                    <p className="zipErrorBox">{errors?.HO_ZIP?.message}</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="cellStyle">
                <div className="errorWrapper">
                  <input
                    type="text"
                    className="reqInputStyle"
                    maxLength="40"
                    {...register(labels.HO_ADDR, {
                      pattern: {
                        value: regexPatterns.HO_ADDR[0],
                        message: regexPatterns.HO_ADDR[1],
                      },
                      required: regexPatterns.required,
                    })}
                    onFocus={onFocusErrors}
                  />
                  {errors[labels.HO_ADDR] && (
                    <p className="addrErrorBox">{errors?.HO_ADDR?.message}</p>
                  )}
                </div>
              </td>
              <td className="cellStyle">
                <input
                  type="text"
                  className="inputStyle"
                  maxLength="20"
                  {...register(labels.HO_ADDR1)}
                />
              </td>
            </tr>
            <tr>
              <th className="headerCellStyle">회사계정유형</th>
              <td colSpan="3" className="cellStyle">
                <select name={labels.ACCT_FG} {...register(labels.ACCT_FG)}>
                  {ACCT_FG_OP.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {isOpenPost ? (
        <ComModel
          width={'560px'}
          height={'600px'}
          title={'우편번호'}
          onClickEvent={onChangeOpenPost}
        >
          <DaumPostcode autoClose onComplete={onCompletePost} />
        </ComModel>
      ) : null}

      {isOpenCompanyName ? (
        <ComModel
          width={'680px'}
          height={'600px'}
          title={'회사명검색'}
          onClickEvent={onChangeOpenCompanyName}
        >
          <CompanyNameSelect
            isOpenCompanyName={isOpenCompanyName}
            onChangeOpenCompanyName={onChangeOpenCompanyName}
            onCompleteCompanyName={onCompleteCompanyName}
          />
        </ComModel>
      ) : null}
    </div>
  );
};

export default CompanyInputBox;
