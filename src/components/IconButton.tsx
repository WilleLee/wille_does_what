import colors from "@constants/colors";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useMemo,
} from "react";

type ButtonType = "default" | "danger" | "complete" | "transparent";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonType?: ButtonType;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const IconButton = forwardRef(function Button(
  props: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const {
    children,
    buttonType = "default",
    fullWidth = true,
    fullHeight = true,
    ...rest
  } = props;
  const [back, activeBack] = useMemo(() => {
    switch (buttonType) {
      case "default":
        return [colors.grey400, colors.grey500];
      case "danger":
        return [colors.red200, colors.red300];
      case "complete":
        return [colors.green200, colors.green300];
      case "transparent":
        return [colors.white, colors.grey50];
      default:
        return [colors.grey200, colors.grey300];
    }
  }, [buttonType]);
  return (
    <button
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${fullWidth ? "100%" : "24px"};
        padding: 0 8px;
        border: 0 solid transparent;
        height: ${fullHeight ? "100%" : "24px"};
        border-radius: 50%;
        -webkit-font-smoothing: antialiased;
        background: ${back};
        color: ${buttonType === "transparent" ? colors.grey700 : colors.white};
        /* font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
        user-select: none; */
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

export default IconButton;
