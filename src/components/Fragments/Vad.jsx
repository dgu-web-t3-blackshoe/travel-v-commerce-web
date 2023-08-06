import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import * as A from "../Home/UploadStyle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Minus from "../../assets/images/minus.svg";
import PlusButton from "../../assets/images/plus-button.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";

const Vad = ({ step, setStartTime, setEndTime, setAdContent, setAdUrl }) => {
  return (
    <A.AdUploadSection>
      {/* {step.second && <Shadow>STEP 2</Shadow>} */}
      <A.TitleLeftBox>
        <A.SpanTitle>광고등록</A.SpanTitle>
        <A.AdUploadButton>
          <A.FullIcon src={PlusButton} alt="plus-button" loading="lazy" />
        </A.AdUploadButton>
      </A.TitleLeftBox>
      <A.AdUploadGridBox>
        <A.AdInputSection>
          <A.TimeBox>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimeField"]}>
                <TimeField
                  label="시작 시간"
                  onChange={(e) => {
                    const receivedTime = new Date(e.$d);
                    const hours = receivedTime.getHours();
                    const minutes = receivedTime.getMinutes();
                    const seconds = receivedTime.getSeconds();
                    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
                    setStartTime(totalMilliseconds.toString());
                  }}
                  format="HH:mm:ss"
                  color="success"
                />
              </DemoContainer>
            </LocalizationProvider>
          </A.TimeBox>
          <A.TimeBox>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimeField"]}>
                <TimeField
                  label="종료 시간"
                  onChange={(e) => {
                    const receivedTime = new Date(e.$d);
                    const hours = receivedTime.getHours();
                    const minutes = receivedTime.getMinutes();
                    const seconds = receivedTime.getSeconds();
                    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
                    setEndTime(totalMilliseconds.toString());
                  }}
                  format="HH:mm:ss"
                  color="success"
                />
              </DemoContainer>
            </LocalizationProvider>
          </A.TimeBox>
          <A.ContentBox>
            <A.NormalSpan>내용</A.NormalSpan>
            <A.AdInput
              type="text"
              placeholder="광고로 등록할 내용을 입력해주세요."
              width="250px"
              height="100px"
              onChange={(e) => setAdContent(e.target.value)}
            />
          </A.ContentBox>
          <A.LinkBox>
            <A.NormalSpan>링크</A.NormalSpan>
            <A.AdInput
              type="text"
              placeholder="광고 링크를 첨부해주세요."
              width="250px"
              height="35px"
              onChange={(e) => setAdUrl(e.target.value)}
            />
          </A.LinkBox>
          <A.RemoveButton>
            <A.SmallImage src={Minus} alt="minus" />
          </A.RemoveButton>
        </A.AdInputSection>
      </A.AdUploadGridBox>
    </A.AdUploadSection>
  );
};

export default Vad;

Vad.propTypes = {
  step: PropTypes.object,
  setStartTime: PropTypes.func,
  setEndTime: PropTypes.func,
  setAdContent: PropTypes.func,
  setAdUrl: PropTypes.func,
};