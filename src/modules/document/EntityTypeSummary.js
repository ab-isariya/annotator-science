import Label from '@ui/Label';
import Loading from '@ui/Loading';

import {NumberCommaSuffix} from '@utils/utils';

import {useDocument} from '@document';

const EntityTypeSummary = () => {
  const {data: document} = useDocument();

  if (!document) {
    //TODO(Rejon): Need loading state for this
    return <Loading />;
  }

  const entityTypes = document.aggregations.entity_types;

  return (
    <>
      <Label className="mb-2.5 uppercase">Entity Type</Label>

      {entityTypes.map((entity) => (
        <div
          className="flex justify-between mb-1.5"
          key={`entity-type-sum-${entity.type}`}>
          {entity.type}
          <p>{NumberCommaSuffix(entity.count_raw, 3)}</p>
        </div>
      ))}
    </>
  );
};

export default EntityTypeSummary;
