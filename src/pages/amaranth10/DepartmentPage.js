import { useEffect, useState } from 'react';
import {
  authAxiosInstance,
  imageAxiosInstance,
} from '../../axios/axiosInstance';
import {
  MainTitle,
  Title,
  DeptHeadTitle,
  DeptSubTitle,
  CompSelectBox,
  DeptTextFieldBox,
} from '../../components/common/Index';
import {
  ContentWrapper,
  DetailContentWrapper,
  MainContentWrapper,
  RightContentWrapper,
  DepartmentSelectBoxWrapper,
  DeptSearchWrapper,
  LeftContentWrapper,
  DeptShowWrapper,
} from '../../components/layout/amaranth/Index';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import CommonLayout2 from '../../components/common/CommonLayout2';
import DeptInfoWrapper from '../../components/feature/amaranth/Department/DeptInfoWrapper';

const DepartmentPage = () => {
  const {
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  }); // react-hook-form 사용
  const [companyData, setCompanyData] = useState([]);
  const [DeptData, setDeptData] = useState([]);
  const [SearchCocd, setSearchCocd] = useState('');

  useEffect(() => {
    fetchCompanyData();
    fetchDepartmentData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await authAxiosInstance.get(
        'system/user/groupManage/employee/getCompanyList'
      );
      const mappedCompanyData = response.data.map(company => ({
        value: company.co_CD,
        label: company.co_NM,
      }));

      setCompanyData(mappedCompanyData);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await authAxiosInstance.get(
        '/system/user/departments/getDeptList'
      );

      console.log(response.data);
      const organizedData = hierarchyData(response.data);
      setDeptData(organizedData);
      console.log(organizedData);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const hierarchyData = data => {
    const result = [];

    // CO_CD를 기준으로 분류
    const coGroups = data.reduce((acc, curr) => {
      if (!acc[curr.co_CD]) {
        acc[curr.co_CD] = [];
      }
      acc[curr.co_CD].push(curr);
      return acc;
    }, {});

    const findSubDepts = (dept_CD, allDepts) => {
      return allDepts
        .filter(dept => dept.mdept_CD === dept_CD)
        .map(dept => ({
          ...dept,
          subDepts: findSubDepts(dept.dept_CD, allDepts),
        }));
    };

    for (const co in coGroups) {
      const coItem = {
        co_CD: co,
        divs: [],
      };

      // DIV_CD를 기준으로 분류
      const divGroups = coGroups[co].reduce((acc, curr) => {
        if (!acc[curr.div_CD]) {
          acc[curr.div_CD] = [];
        }
        acc[curr.div_CD].push(curr);
        return acc;
      }, {});

      for (const div in divGroups) {
        const topLevelDepts = divGroups[div].filter(dept => !dept.mdept_CD);
        topLevelDepts.forEach(dept => {
          dept.subDepts = findSubDepts(dept.dept_CD, divGroups[div]);
        });

        const divItem = {
          div_CD: div,
          depts: topLevelDepts,
        };

        coItem.divs.push(divItem);
      }

      result.push(coItem);
    }

    return result;
  };

  return (
    <>
      <CommonLayout2>
        <MainTitle mainTitle={'시스템설정'} />
        <ContentWrapper>
          <Title titleName={'부서관리'}></Title>
          <DetailContentWrapper>
            <DepartmentSelectBoxWrapper />
            <MainContentWrapper>
              <LeftContentWrapper>
                <DeptSearchWrapper width={'350px'}>
                  <CompSelectBox
                    data={companyData}
                    height={30}
                    width={315}
                    onSelectChange={selectedCoCd => setSearchCocd(selectedCoCd)}
                  />
                  <DeptTextFieldBox width={'100px'} />
                </DeptSearchWrapper>
                <DeptShowWrapper
                  width={'350px'}
                  title={'조직도'}
                  data={DeptData}
                />
              </LeftContentWrapper>
              <RightContentWrapper>
                <DeptHeadTitle titleName={'상세정보'}></DeptHeadTitle>
                <DeptSubTitle>
                  <div className="subTitleInfo">기본정보</div>
                  <div className="subTitleInfo2">부서원 정보</div>
                </DeptSubTitle>
                <DeptInfoWrapper />
              </RightContentWrapper>
            </MainContentWrapper>
          </DetailContentWrapper>
        </ContentWrapper>
      </CommonLayout2>
    </>
  );
};

export default DepartmentPage;
