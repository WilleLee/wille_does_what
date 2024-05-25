import colors from "@constants/colors";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useMemo,
} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
  buttonType?: "default" | "danger";
}

const Button = forwardRef(function Button(
  props: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const {
    children,
    buttonType = "default",
    fullWidth = true,
    fullHeight = false,
    ...rest
  } = props;
  const [back, activeBack] = useMemo(() => {
    switch (buttonType) {
      case "danger":
        return [colors.red500, colors.red700];
      default:
        return [colors.grey500, colors.grey700];
    }
  }, [buttonType]);
  return (
    <button
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${fullWidth ? "100%" : "auto"};
        padding: 0 8px;
        border: 0 solid transparent;
        height: ${fullHeight ? "100%" : "36px"};
        border-radius: 10px;
        -webkit-font-smoothing: antialiased;
        background: ${back};
        color: ${colors.white};
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        user-select: none;
        transition: background 0.1s ease-in-out;
        cursor: pointer;

        &:focus {
          outline: none;
        }
        &:disabled {
          opacity: 0.26;
          cursor: not-allowed;
        }
        &:active {
          background: ${activeBack};
        }
      `}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
