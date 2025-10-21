import { Container, PureContainerConfig } from "./Container";

export class PureContainer<Config extends PureContainerConfig = PureContainerConfig> extends Container<Config> {
   public isPureContainer: boolean = true;
}

PureContainer.alias("pure-container", PureContainer);
