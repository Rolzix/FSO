import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleSheet,
} from "react-native";

import theme from "../constants/Theme";

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

interface TextProps extends NativeTextProps {
  color?: string;
  fontSize?: number | string;
  fontWeight?: string;
}

const Text: React.FC<TextProps> = ({
  color,
  fontSize,
  fontWeight,
  style,
  ...props
}) => {
  const textStyle = [
    styles.text,
    color === "textSecondary" && styles.colorTextSecondary,
    color === "primary" && styles.colorPrimary,
    fontSize === "subheading" && styles.fontSizeSubheading,
    fontWeight === "bold" && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
