import SettingIcon from "../../../shared/icons/SettingIcon";
import style from "./SettingButton.module.scss";

interface SettingButtonProps {
    onOpenSettingPanel: (open: boolean) => void;
}

const SettingButton: React.FC<SettingButtonProps> = ({
    onOpenSettingPanel,
}) => {
    return (
        <div
            className={style.settingButton}
            onClick={() => onOpenSettingPanel(true)}
        >
            <button className={style.settingButton__btn}>
                <SettingIcon className={style.settingButton__icon} />
            </button>
        </div>
    );
};

export default SettingButton;
