import { useContext, useEffect, useState } from "react";
import Header from "../components/Fragments/Header";
import Nav from "../components/Fragments/Nav";
import { GridWrapper } from "../components/Home/HomeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import ResNav from "../components/Fragments/ResNav";
import {
  AdInput,
  AdInputSection,
  AdUploadButton,
  AdUploadGridBox,
  AdUploadSection,
  ContentBox,
  FullIcon,
  LinkBox,
  NormalSpan,
  RemoveButton,
  Shadow,
  SmallImage,
  SpanTitle,
  TimeBox,
  TitleBetweenBox,
  TitleLeftBox,
  VideoForm,
  VideoUploadSection,
} from "../components/Home/UploadStyle";
import Minus from "../assets/images/minus.svg";
import PlusButton from "../assets/images/plus-button.svg";
import axios from "axios";
import Vupload from "../components/Fragments/Vupload";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { ColorButton } from "../components/Sign/SignStyle";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import Stomp from "stompjs";
import Vinfo from "../components/Fragments/Vinfo";
import Vad from "../components/Fragments/Vad";

// Upload EC2
// 13.125.69.94:8021
// Content-Slave
// 13.125.69.94:8011

const Upload = () => {
  // Constant----------------------------------------------------
  const navigate = useNavigate();
  const { userId } = useParams();

  // State-------------------------------------------------------
  const { setPage } = useContext(GlobalContext);
  const [step, setStep] = useState({
    first: true,
    second: false,
  });
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [preview, setPreview] = useState(null);

  //
  const [videoName, setVideoName] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [tagIdList, setTagIdList] = useState([]);
  const [regionTag, setRegionTag] = useState([]);
  const [themeTag, setThemeTag] = useState([]);
  const [adUrl, setAdUrl] = useState("");
  const [adContent, setAdContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Function----------------------------------------------------
  const fetchData = async () => {
    try {
      await axios
        .get(`http://13.125.69.94:8021/upload-service/videos/temporary/${userId}`)
        .then(async (res) => {
          if (res.status === 200) {
            if (window.confirm("이전에 작성하던 영상이 있습니다. 이어서 작성하시겠습니까?")) {
              setVideoId(res.data.payload.videoId);
              setVideoName(res.data.payload.videoName);
              setStep({
                first: false,
                second: true,
              });
            } else {
              await axios.delete(
                `http://13.125.69.94:8021/upload-service/videos/temporary/${userId}/${res.data.payload.videoId}`
              );
            }
          }
        });
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        console.log("이전에 작성하던 영상이 없습니다.");
        return;
      } else if (err.response.status === 500) {
        console.log("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }

    const regionData = await axios.get(`http://13.125.69.94:8021/upload-service/tags/region`);
    const themeData = await axios.get(`http://13.125.69.94:8021/upload-service/tags/theme`);
    setRegionTag(regionData.data.payload.tags);
    setThemeTag(themeData.data.payload.tags);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("동영상을 첨부해주세요");
    } else if (!step.second) {
      if (window.confirm("동영상을 등록하고 다음 단계로 넘어가시겠습니까?")) {
        if (videoFile) {
          try {
            setLoading(true);
            setIsSocketOpen(true);
            const formData = new FormData();
            formData.append("video", videoFile);
            await axios
              .post(`http://13.125.69.94:8021/upload-service/videos/${userId}`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                console.log(res);
                setLoading(false);
                setIsSocketOpen(true);
                alert("영상이 업로드되었습니다.");
                setPreview(res.data.payload.videoCloudfrontUrl);
                setVideoId(res.data.payload.videoId);
                setStep({
                  ...step,
                  second: true,
                });
              });
          } catch (err) {
            console.log(err);
            setLoading(false);
            setIsSocketOpen(true);
            alert("업로드에 실패했습니다.");
          }
        }
      }
    } else {
      if (window.confirm("동영상 최종 업로드를 시작합니다.")) {
        const requestData = {
          thumbnail: thumbnailFile,
          requestUpload: {
            videoName: videoName,
            tagIdList: tagIdList,
            adList: [
              {
                adUrl: adUrl,
                adContent: adContent,
                startTime: startTime,
                endTime: endTime,
              },
            ],
          },
        };
        const jsonData = JSON.stringify(requestData.requestUpload);
        const blob = new Blob([jsonData], { type: "application/json" });
        const formData = new FormData();
        formData.append("thumbnail", thumbnailFile);
        formData.append("requestUpload", blob);

        try {
          await axios
            .post(`http://13.125.69.94:8021/upload-service/videos/${userId}/${videoId}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log(res);
              alert("동영상 최종 업로드가 완료되었습니다.");
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  // ComponentDidMount-------------------------------------------
  useEffect(() => {
    setPage(1);
    fetchData();
  }, []);

  useEffect(() => {
    let stompClient;

    const openSocket = () => {
      const socket = new SockJS("http://13.125.69.94:8021/ws");
      stompClient = Stomp.over(socket);
      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/encoding/${userId}`, (message) => {
          const messageBody = JSON.parse(message.body);
          setPercentage(Math.floor(messageBody.encodedPercentage));
        });
      });
    };

    const closeSocket = () => {
      if (stompClient) {
        stompClient.disconnect(() => {});
      }
    };

    if (isSocketOpen) {
      openSocket();
    } else {
      closeSocket();
    }

    return () => {
      closeSocket();
    };
  }, [isSocketOpen]);

  return (
    <GridWrapper>
      <Header />
      <Nav />
      <VideoForm encType="multipart/form-data">
        <ResNav userId={userId} />
        <VideoUploadSection>
          <TitleBetweenBox>
            <SpanTitle>영상 등록</SpanTitle>
            <ColorButton width="65px" style={{ height: "35px" }} onClick={handleNextStep}>
              {step.first && step.second ? "등록" : "다음"}
            </ColorButton>
          </TitleBetweenBox>
          {/* 영상 업로드 컴포넌트 조각 */}
          <Vupload
            userId={userId}
            step={step}
            setStep={setStep}
            loading={loading}
            percentage={percentage}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            preview={preview}
            setPreview={setPreview}
          />
          <br />
          {/* 영상 정보 등록 컴포넌트 조각 */}
          <Vinfo
            step={step}
            regionTag={regionTag}
            themeTag={themeTag}
            setVideoName={setVideoName}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            tagIdList={tagIdList}
            setTagIdList={setTagIdList}
          />
        </VideoUploadSection>
        {/* 영상 광고 등록 컴포넌트 조각 */}
        <Vad
          step={step}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          setAdContent={setAdContent}
          setAdUrl={setAdUrl}
        />
      </VideoForm>
    </GridWrapper>
  );
};

export default Upload;
