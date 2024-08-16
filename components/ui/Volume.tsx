import { Slider } from '@/components/ui/slider';
import { IoMdVolumeHigh } from 'react-icons/io';

const Volume = () => {
  return (
    <>
      <div>
        <IoMdVolumeHigh />
      </div>

      <div>
        <Slider defaultValue={[33]} max={100} step={1} />
      </div>
    </>
  );
};

export default Volume;
