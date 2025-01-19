import EcomsIconLogo from "@atoms/ecomsLogo";
import { ANIMATIONS_TYPES } from "@constant/animations";
import { BORDER_RADIUS } from "@constant/editorStylesProperties";
import { removeObjRef } from "@util/utils";
import { Button, Card, Drawer, Flex, InputNumber, Select, Slider, Tooltip, Typography, theme } from "antd";
import { Fragment, useMemo, useState } from "react";
import { LuEye, LuX } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import Border from "../border";
import BoxShadow from "../boxShadow";
import DirectionProperty from "../directionProperty";
const { Text } = Typography

const HoverProperties = {
    border: "Border",
    boxShadow: "Box Shadow",
    background: "Background",
    scale: "Scale",
}
function AnimationsStyles({ animationConfig, onConfigUpdate }) {

    const [showAnimations, setShowAnimations] = useState(false);
    const [activeType, setActiveType] = useState(null)
    const { token } = theme.useToken();
    const { ref, inView } = useInView({ threshold: 0.5 });
    const Animation = {
        "name": "bounce",
        "duration": "1s",
        "delay": "0s",
        "timingFunction": "ease-in-out"
    }
    const animationStyle = useMemo(() => ({ animation: `${Animation.name} ${Animation.duration} ${Animation.timingFunction}` }), []);

    const onChange = (from: string, value: any) => {
        let configCopy = removeObjRef(animationConfig);
        if (!Boolean(configCopy)) {
            configCopy = {
                onAppear: Animation
            }
        }
        if (!Boolean(configCopy.onAppear)) {
            configCopy.onAppear = {
                "name": "fadeIn",
                "duration": "1s",
                "delay": "0s",
                "timingFunction": "ease-in-out"
            }
        }
        configCopy.onAppear[from] = value
        onConfigUpdate(configCopy)
    }


    const onRemoveAnimation = () => {
        let configCopy = removeObjRef(animationConfig);
        delete configCopy.animations;
        onConfigUpdate(null)
    }

    const onHoverStyleChange = (from, value) => {
        let configCopy = removeObjRef(animationConfig);
        if (!Boolean(configCopy)) {
            configCopy = {
                onHover: {}
            }
        }
        if (!Boolean(configCopy.onHover)) {
            configCopy.onHover = {}
        }
        configCopy.onHover[from] = value
        if (from == "scale" && !Boolean(value)) delete configCopy.onHover.scale;
        onConfigUpdate(configCopy)
    };

    const renderOnHoverAnimation = () => {
        return <Card
            styles={{ body: { padding: 10 }, header: { padding: 10, minHeight: "unset" } }}
            title="On Hover Animations"
            extra={<Tooltip title="Remove Animations">
                <Button onClick={onRemoveAnimation} danger icon={<LuX />} type="text" />
            </Tooltip>}>
            <Flex vertical gap={10} style={{ width: "100%" }}>

                <Border showSaperator={false} value={animationConfig?.onHover?.border || '0px solid #dee1ec'} onChange={onHoverStyleChange} />

                <DirectionProperty propertyType={BORDER_RADIUS} value={animationConfig?.onHover?.borderRadius} onChange={onHoverStyleChange} />

                <BoxShadow showSaperator={false} value={animationConfig?.onHover?.boxShadow} onChange={onHoverStyleChange} />

                <Flex justify='space-between' gap={10} align='center'>
                    <Text strong style={{ minWidth: 50 }}>Scale</Text>
                    <Slider
                        style={{ width: 140 }}
                        min={0}
                        max={2}
                        step={0.1}
                        onChange={(value: any) => onHoverStyleChange('scale', value)}
                        value={Number(animationConfig?.onHover?.scale || 0)}
                    />
                    <InputNumber
                        min={0}
                        max={2}
                        step={0.1}
                        onChange={(value: any) => onHoverStyleChange('scale', value)}
                        value={Number(animationConfig?.onHover?.scale || 0)}
                    />
                </Flex>

            </Flex>
        </Card>
    }

    const renderOnAppearAnimation = () => {
        return <Card
            styles={{ body: { padding: 10 }, header: { padding: 10, minHeight: "unset" } }}
            title="On Appear Animations"
            extra={<Tooltip title="Remove Animations">
                <Button onClick={onRemoveAnimation} danger icon={<LuX />} type="text" />
            </Tooltip>}>
            <Flex vertical gap={10} style={{ width: "100%" }}>
                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "max-content" }}>Style</Text>
                    <Select
                        defaultValue={''}
                        value={animationConfig?.onAppear?.name}
                        style={{ width: 140 }}
                        onChange={(value) => onChange('name', value)}
                        optionLabelProp="label"
                        options={Object.keys(ANIMATIONS_TYPES).map((type) => ({ label: ANIMATIONS_TYPES[type], value: type }))}
                    />
                </Flex>
                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "max-content" }}>Duration</Text>
                    <InputNumber
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={(value: any) => onChange('duration', `${value}s`)}
                        value={Number(animationConfig?.onAppear?.duration?.split("s")[0] || 0)}
                    />
                </Flex>
                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "max-content" }}>Delay</Text>
                    <InputNumber
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={(value: any) => onChange('delay', `${value}s`)}
                        value={Number(animationConfig?.onAppear?.delay?.split("s")[0] || 0)}
                    />
                </Flex>
            </Flex>
        </Card>
    }

    return (
        <>
            <Flex vertical gap={10} style={{ width: "100%", ...animationStyle }} >
                <Flex justify='space-between' gap={10} align='center'>
                    <Text strong>Animations</Text>
                    <Tooltip title="View All Animations">
                        <Button onClick={() => setShowAnimations(true)} icon={<LuEye />} type="text">View All</Button>
                    </Tooltip>
                </Flex>
                {renderOnAppearAnimation()}
                {renderOnHoverAnimation()}
            </Flex>
            <Drawer title="Animations In Action"
                // style={{ width: 300 }}
                open={showAnimations}
                onClose={() => setShowAnimations(false)}
            >
                <Flex vertical style={{ width: "100%" }}>
                    <Flex justify='space-evenly' gap={10} wrap="wrap">
                        {Object.keys(ANIMATIONS_TYPES).map((type) => {
                            return <Fragment key={type}>
                                <Card
                                    onClick={() => {
                                        onChange('name', type);
                                        setShowAnimations(false);
                                    }}
                                    hoverable
                                    onMouseEnter={() => setActiveType(type)}
                                    onMouseLeave={() => setActiveType(null)}
                                    title={ANIMATIONS_TYPES[type]}
                                    style={{
                                        width: "48%",
                                        height: "auto",
                                    }}
                                    styles={{ body: { padding: 10 }, header: { padding: 10, minHeight: "unset" } }}
                                >
                                    <Flex style={{
                                        filter: `drop-shadow(4px 2px 6px ${token.colorPrimaryBg})`,
                                        animation: activeType == type ? `1s linear ${type}` : "unset"
                                    }}>
                                        <EcomsIconLogo />
                                    </Flex>
                                </Card>
                            </Fragment>
                        })}
                    </Flex>
                </Flex>
            </Drawer>
        </>

    )
}

export default AnimationsStyles