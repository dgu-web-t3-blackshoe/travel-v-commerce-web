import { useNavigate } from "react-router-dom";
import { Wrapper } from "../components/Home/HomeStyle";
import {
  ColorButton,
  HalfSection,
  Logo,
  RightAlignSection,
  SignForm,
  SignInput,
  SignUpText,
  SubText,
} from "../components/Sign/SignStyle";
import logo from "../assets/images/logo.svg";

const SignIn = () => {
  // Constant--------------------------------------------------
  const navigate = useNavigate();

  // State-----------------------------------------------------

  return (
    <Wrapper>
      <HalfSection style={{ backgroundColor: "#eaeaea" }}>Image Swiper</HalfSection>
      <HalfSection>
        <SignForm>
          <Logo src={logo} alt="logo" loading="lazy" />
          <SubText>판매자 로그인</SubText>
          <SignInput type="text" placeholder="ID" width="450px" />
          <SignInput type="text" placeholder="PW" width="450px" />
          <ColorButton width="450px" onClick={() => navigate("/home/1")}>
            시작하기
          </ColorButton>
          <RightAlignSection>
            <SignUpText onClick={() => navigate("/signup")}>회원가입</SignUpText>
          </RightAlignSection>
        </SignForm>
      </HalfSection>
    </Wrapper>
  );
};

export default SignIn;
