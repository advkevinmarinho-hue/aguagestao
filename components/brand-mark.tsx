import Svg, { Circle, Path } from "react-native-svg";

type BrandMarkProps = {
  size?: number;
  primary?: string;
  navy?: string;
};

export function BrandMark({ size = 58, primary = "#168CCF", navy = "#080D2B" }: BrandMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityLabel="Marca SK Água Gestão">
      <Path d="M47.8 11.5C36.7 27.2 28.5 37 28.5 51.7c0 12.4 8.7 22.5 19.3 22.5s19.3-10.1 19.3-22.5c0-14.7-8.2-24.5-19.3-40.2Z" fill={primary} />
      <Path d="M45.1 18.8C37.6 31 33.9 39.2 33.9 49.6c0 7.8 4.6 14.4 11.2 17" fill="none" stroke="#BCE7FA" strokeLinecap="round" strokeWidth="3.5" />
      <Path d="M17 45C22 25 38 14 58 17c8.8 1.3 15.5 5.8 20.5 11.9" fill="none" stroke={navy} strokeLinecap="round" strokeWidth="6" />
      <Path d="M15 61c7.2 14.4 21.7 23.6 38 23.6 12.4 0 23.7-5.3 31.6-13.8" fill="none" stroke={navy} strokeLinecap="round" strokeWidth="6" />
      <Path d="M17.5 68.2c9.7 9.7 24.9 13.7 38.8 9.2" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="3.5" />
      <Circle cx="75" cy="28" r="2.5" fill={primary} />
    </Svg>
  );
}
