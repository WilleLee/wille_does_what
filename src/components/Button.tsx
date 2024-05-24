import colors from "@constants/colors";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  danger?: boolean;
}

const Button = forwardRef(function Button(
  props: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { children, danger = false, fullWidth = true, ...rest } = props;
  return (
    <button
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${fullWidth ? "100%" : "auto"};
        padding: 0 8px;
        border: 0 solid transparent;
        height: 36px;
        border-radius: 10px;
        -webkit-font-smoothing: antialiased;
        background: ${danger ? colors.red500 : colors.grey500};
        color: ${colors.white};
        font-size: 15px;
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
          background: ${danger ? colors.red700 : colors.grey700};
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
