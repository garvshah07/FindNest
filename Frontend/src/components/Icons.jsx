import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineArrowLeft,
  HiSparkles,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineHomeModern,
} from "react-icons/hi2";

export function LogoIcon({ className = "w-6 h-6" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <HiOutlineHomeModern className="w-full h-full text-indigo-400" />
    </div>
  );
}

export function MailIcon({ className = "w-4 h-4" }) {
  return <HiOutlineEnvelope className={className} />;
}

export function LockIcon({ className = "w-4 h-4" }) {
  return <HiOutlineLockClosed className={className} />;
}

export function EyeIcon({ className = "w-4 h-4" }) {
  return <HiOutlineEye className={className} />;
}

export function EyeOffIcon({ className = "w-4 h-4" }) {
  return <HiOutlineEyeSlash className={className} />;
}

export function UserIcon({ className = "w-4 h-4" }) {
  return <HiOutlineUser className={className} />;
}

export function CheckIcon({ className = "w-4 h-4" }) {
  return <HiOutlineCheck className={className} />;
}

export function CheckCircleIcon({ className = "w-4 h-4" }) {
  return <HiOutlineCheckCircle className={className} />;
}

export function AlertCircleIcon({ className = "w-4 h-4" }) {
  return <HiOutlineExclamationCircle className={className} />;
}

export function ArrowLeftIcon({ className = "w-4 h-4" }) {
  return <HiOutlineArrowLeft className={className} />;
}

export function SparklesIcon({ className = "w-4 h-4" }) {
  return <HiSparkles className={className} />;
}

export function RefreshCwIcon({ className = "w-4 h-4" }) {
  return <HiOutlineArrowPath className={className} />;
}
