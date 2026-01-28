import { ContainerBase, ContainerConfig } from "./Container";
import { Instance } from "./Instance";

export interface PureContainerConfig extends ContainerConfig {}

// Base class for extending with custom Config types
export class PureContainerBase<
   Config extends PureContainerConfig = PureContainerConfig,
   InstanceType extends Instance = Instance,
> extends ContainerBase<Config, InstanceType> {
   declare public isPureContainer: boolean;
}

PureContainerBase.prototype.isPureContainer = true;

// Closed type for direct usage - preserves ControllerProp ThisType
export class PureContainer extends PureContainerBase<PureContainerConfig, Instance> {}

PureContainer.alias("pure-container", PureContainer);
