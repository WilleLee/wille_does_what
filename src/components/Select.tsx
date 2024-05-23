import colors from "@constants/colors";
import { css } from "@emotion/react";
import {
  ForwardedRef,
  ReactNode,
  SelectHTMLAttributes,
  forwardRef,
} from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

const Select = forwardRef(function Select(
  props: Props,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const { children, ...rest } = props;
  return (
    <div
      css={css`
        width: 100%;
        height: 36px;
        position: relative;
      `}
    >
      <select
        css={css`
          width: 100%;
          height: 100%;
          /* -o-appearance: none;
          -ms-appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none; */
          padding-left: 10px;
          border-radius: 10px;
          border: 0px solid transparent;
          -webkit-font-smoothing: antialiased;
          background: ${colors.green100};
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
          user-select: none;
          transition: background 0.1s ease-in-out;
          color: ${colors.black};
          cursor: pointer;

          &:focus {
            outline: none;
          }
          &:active {
            background: ${colors.green200};
          }
          &:disabled {
            opacity: 0.26;
            cursor: not-allowed;
          }
        `}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});

export default Select;
