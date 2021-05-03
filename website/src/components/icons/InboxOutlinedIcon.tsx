export interface InboxOutlinedIconProps {
  size?: number;
  className?: string;
}

const InboxOutlinedIcon: React.FC<InboxOutlinedIconProps> = ({
  className,
  size
}) => {
  return (
    <svg
      version="1.1"
      className={className}
      width={size}
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          d="M189.39,163.35c2.8,0,5.52,0.96,7.7,2.73l47.18,38.16V47.35c0-6.77,5.49-12.26,12.26-12.26c6.77,0,12.26,5.49,12.26,12.26
		v156.63l46.04-37.84c5.23-4.3,12.96-3.54,17.26,1.69c4.3,5.23,3.54,12.95-1.69,17.25l-66.09,54.32
		c-4.49,3.69-10.96,3.72-15.49,0.06l-67.14-54.31c-4.04-3.27-5.58-8.73-3.84-13.62C179.57,166.62,184.2,163.35,189.39,163.35z"
        />
        <path
          d="M505.09,270.18l0.06,0.01l-48.35-109.22c-10.8-23.6-34.35-38.74-60.3-38.77h-31.33c-6.77,0-12.26,5.49-12.26,12.26
		c0,6.77,5.49,12.26,12.26,12.26h31.33c16.35,0.02,31.19,9.57,38,24.43l41.49,90.97l-1.38-0.32h-66.28
		c-30.05-0.15-57.38,17.39-69.77,44.77c-8.97,18.83-27.98,30.82-48.84,30.81h-67.44c-20.86,0.01-39.86-11.98-48.84-30.81
		c-12.39-27.38-39.72-44.92-69.77-44.77H38.56h-2.39l41.33-90.64c6.81-14.87,21.65-24.41,38-24.43h31.33
		c6.77,0,12.26-5.49,12.26-12.26c0-6.77-5.49-12.26-12.26-12.26H115.5c-25.95,0.03-49.5,15.18-60.31,38.77L6.98,269.81l0.12-0.02
		c-0.57,0.93-1,1.94-1.09,3.05v144.77c0.93,32.59,27.29,58.69,59.88,59.3h380.23c32.59-0.61,58.96-26.72,59.88-59.3V272.84
		C505.86,271.9,505.52,271.02,505.09,270.18z M482.74,417.6c-0.9,19.74-16.87,35.46-36.63,36.05H65.88
		c-19.76-0.59-35.72-16.3-36.63-36.05V285.05h74.42c20.86-0.01,39.87,11.98,48.84,30.81c12.39,27.38,39.72,44.92,69.77,44.77h67.44
		c30.05,0.15,57.38-17.39,69.77-44.77c8.97-18.83,27.98-30.82,48.84-30.81h74.42V417.6z"
        />
      </g>
    </svg>
  );
};

export default InboxOutlinedIcon;