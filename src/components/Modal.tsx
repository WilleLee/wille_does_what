import { GlobalPortal } from "@/GlobalPortal";
import colors from "@constants/colors";
import { css } from "@emotion/react";
import { ReactNode } from "react";
import Button from "@components/Button";
import IconButton from "@components/IconButton";
import XSvg from "@components/svgs/XSvg";

export default function Modal({
  onConfirm,
  onClose,
  children,
}: {
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <GlobalPortal.Element>
      <div
        css={css`
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        `}
      >
        <div
          css={css`
            padding: 16px 8px;
            width: 280px;
            background-color: ${colors.white};
            border: 0 solid transparent;
            border-radius: 5px;
          `}
        >
          <div
            css={css`
              margin-bottom: 12px;
              display: grid;
              grid-template-columns: 28px 1fr 28px;
              grid-template-rows: 28px;
              align-items: center;
            `}
          >
            <div />
            <h3
              css={css`
                text-align: center;
                font-weight: 600;
                font-size: 16px;
              `}
            >
              알림
            </h3>
            <IconButton buttonType="transparent" onClick={onClose}>
              <XSvg />
            </IconButton>
          </div>
          <div
            css={css`
              max-height: 120px;
              overflow-y: scroll;
              overscroll-behavior: contain;
              margin-bottom: 16px;
              font-size: 14px;
              text-align: center;
            `}
          >
            {children}
          </div>
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              column-gap: 4px;
            `}
          >
            <Button danger data-testid="modal_confirm" onClick={onConfirm}>
              확인
            </Button>
            <Button data-testid="modal_cancel" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </GlobalPortal.Element>
  );
}
