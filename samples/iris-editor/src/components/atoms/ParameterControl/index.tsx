import { css } from "@emotion/react";
import {
  FC,
  Fragment,
  HTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ParameterControlProps = Omit<
  HTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  min: number;
  max: number;
  value: number;
  onChange?(value: number): void;
};

export const ParameterControl: FC<ParameterControlProps> = (props) => {
  const { min, max, value: inputValue, onChange, ...baseProps } = props;
  const [value, setValue] = useState(inputValue);

  const scrubTrackWidth = useRef<number>(0);
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valueCent = useMemo(() => Math.round(value * 100), [value]);
  const length = useMemo(() => max + -min, [max, min]);

  const drawTrack = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }

    const pixelRatio = window?.devicePixelRatio ?? 1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth * pixelRatio * (length / 2);
    // ^ 50% per unit. For some reason the canvas clientWidth isn't what I expected..
    // Therefore, I multiply it by (length / 2)
    const h = canvas.clientHeight * pixelRatio;
    const totalMarks = length * 20;
    const distanceBetweenMarks = (w - pixelRatio) / totalMarks;
    canvas.width = w;
    canvas.height = h;
    scrubTrackWidth.current = canvas.clientWidth;

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.8 * pixelRatio;

    for (let m = 0; m <= totalMarks; m++) {
      const x = Math.floor(m * distanceBetweenMarks) + pixelRatio / 2;

      ctx.beginPath();
      ctx.strokeStyle = m % 10 === 0 ? "#fff" : "#5c5c5c";

      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.closePath();
    }
  }, [length]);

  const handleScrubTrackScroll = useCallback(
    (event: Event) => {
      const scrubTrack = event.currentTarget as HTMLDivElement;
      const scrollLeft = scrubTrack.scrollLeft;
      const trackWidth = scrubTrackWidth.current;

      const newValue = (scrollLeft / trackWidth) * length + min;

      setValue(newValue);

      if (onChange !== undefined) {
        onChange(newValue);
      }
    },
    [min, length, onChange]
  );

  useLayoutEffect(() => {
    drawTrack();
  }, [drawTrack]);

  useEffect(() => {
    if (!scrubTrackRef.current) {
      return;
    }
    const scrubTrack = scrubTrackRef.current;

    scrubTrack.addEventListener("scroll", handleScrubTrackScroll, {
      passive: true,
    });

    return () => {
      scrubTrack.removeEventListener("scroll", handleScrubTrackScroll);
    };
  }, [handleScrubTrackScroll]);

  useEffect(() => {
    if (!scrubTrackRef.current) {
      return;
    }
    const scrubTrack = scrubTrackRef.current;
    const newValue = ((value - min) / length) * scrubTrackWidth.current;

    scrubTrack.scrollLeft = newValue;
  }, [value, length, min]);

  useEffect(() => {
    if (value !== inputValue) {
      setValue(inputValue);
    }
  }, [inputValue]);

  return (
    <Fragment>
      {/* <input type="range" min={min} max={max} value={value} {...baseProps} /> */}
      <div
        css={css`
          position: relative;
          width: 100%;

          &:before {
            content: "";
            pointer-events: none;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(
              90deg,
              rgba(35, 35, 35, 1),
              rgba(35, 35, 35, 0) 20%,
              rgba(35, 35, 35, 0) 80%,
              rgba(35, 35, 35, 1)
            );
          }
        `}
        {...baseProps}
      >
        <div
          css={css`
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            height: 45px;
          `}
        >
          <div
            css={css`
              background: #61c781;
              position: absolute;
              left: 50%;
              transform: translateX(-2px);
              top: 18px;
              bottom: 0;
              border-left: 1px solid #232323;
              border-right: 1px solid #232323;
              width: 1px;
            `}
          />
          <div
            css={css`
              color: #61c781;
              font-size: 12px;
              font-weight: regular;
              text-align: center;
              text-overflow: visible;
              text-transform: uppercase;
              text-align: center;
              width: 4em;
              pointer-events: none;
            `}
          >
            {valueCent}
          </div>
        </div>
        <div
          ref={scrubTrackRef}
          css={css`
            display: flex;
            overflow-x: scroll;
            overflow-y: hidden;
            padding-top: 30px;
            padding-bottom: 37px;

            &:before,
            &:after {
              content: "";
              display: block;
              flex: 0 0 calc(50% - 1px);
            }
          `}
        >
          <canvas
            ref={canvasRef}
            css={css`
              flex: 0 0 ${length * 50}%;
              height: 15px;
            `}
          />
        </div>
      </div>
    </Fragment>
  );
};
