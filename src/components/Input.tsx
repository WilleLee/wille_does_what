import colors from "@constants/colors";
import { css } from "@emotion/react";
import { InputHTMLAttributes, Ref, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

const Input = forwardRef(function Input(
  props: Props,
  forwardedRef: Ref<HTMLInputElement>,
) {
  const { fullWidth = true, ...rest } = props;
  return (
    <div
      css={css`
        width: ${fullWidth ? "100%" : "auto"};
        height: 36px;
        border: 0 solid transparent;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 2px 1px ${colors.grey100};
        transition: box-shadow 0.1s ease-in-out;
        &:focus-within {
          box-shadow: 0 0 8px 1px ${colors.red100};
        }
      `}
    >
      <input
        css={css`
          width: 100%;
          height: 100%;
          padding: 0 10px;
          border: 0 solid transparent;
          -webkit-font-smoothing: antialiased;
          white-space: nowrap;
          user-select: none;
          cursor: text;
          background: transparent;

          &:focus {
            outline: none;
          }
          &:disabled {
            background: ${colors.grey300};
            cursor: not-allowed;
          }
          /* &:active {
            background: ${colors.grey100};
          } */
        `}
        ref={forwardedRef}
        {...rest}
      />
    </div>
  );
});

export default Input;
