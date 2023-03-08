import { expect } from 'chai';
import metadata from '../../src/meta/metadata';

describe('metadata function', () => {
  it('should build a model for salesforce', async () => {
    const model = await metadata(
      {
        filter: ['Asset'],
      },
      true
    );
    expect(model).to.be.ok;
    expect(model.name).to.eql('salesforce');
    expect(model.children.length).to.eql(2);
  });

  it('should build an entity for salesforce Asset', async () => {
    const model = await metadata(
      {
        filter: ['Asset'],
      },
      true
    );

    const [asset] = model.children;
    expect(asset.name).to.eql('Asset');
    expect(asset.type).to.eql('sobject');
    expect(asset.meta?.system).to.be.true;
  });

  it('should build an entity for salesforce vera__Attendance__c', async () => {
    const model = await metadata(
      {
        filter: ['vera__Attendance__c'],
      },
      true
    );

    const [_asset, vera] = model.children;
    expect(vera.name).to.eql('vera__Attendance__c');
    expect(vera.type).to.eql('sobject');
    expect(vera.meta?.system).to.not.be.ok;
  });

  it('should build fields for salesforce Asset', async () => {
    const model = await metadata(
      {
        filter: ['Asset'],
      },
      true
    );

    const [asset] = model.children;
    const fields = asset.children;
    expect(fields).to.be.ok;
    expect(fields.length).to.eql(25);
  });

  it('should build a SerialNumber field for salesforce Asset', async () => {
    const model = await metadata(
      {
        filter: ['Asset'],
      },
      true
    );

    const [asset] = model.children;
    const sn = asset.children.find(({ name }) => name === 'SerialNumber');
    expect(sn).to.be.ok;
    expect(sn.type, 'field');
    expect(sn.datatype, 'string');
    expect(sn.label, 'Serial Number');
  });
});
