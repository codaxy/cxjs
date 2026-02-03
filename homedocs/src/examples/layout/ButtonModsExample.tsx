import { Button } from "cx/widgets";

// @index
export default (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2 items-center">
      <Button mod="primary">Primary</Button>
      <Button mod="primary" pressed>
        Pressed
      </Button>
      <Button mod="primary" disabled>
        Disabled
      </Button>
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      <Button mod="danger">Danger</Button>
      <Button mod="danger" pressed>
        Pressed
      </Button>
      <Button mod="danger" disabled>
        Disabled
      </Button>
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      <Button mod="hollow">Hollow</Button>
      <Button mod="hollow" pressed>
        Pressed
      </Button>
      <Button mod="hollow" disabled>
        Disabled
      </Button>
    </div>
  </div>
);
// @index-end
