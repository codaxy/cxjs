import { Container, ContainerConfig } from "./Container";
import { Instance } from "./Instance";

export interface PureContainerConfig extends ContainerConfig {}

export class PureContainer<
   Config extends PureContainerConfig = PureContainerConfig,
   InstanceType extends Instance = Instance
> extends Container<Config, InstanceType> {
   public isPureContainer: boolean = true;
}

PureContainer.alias("pure-container", PureContainer);
