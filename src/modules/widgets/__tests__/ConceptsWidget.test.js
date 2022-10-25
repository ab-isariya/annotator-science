import ConceptsWidget, {queryConcepts} from '../ConceptsWidget';
import ConceptsWidget_Sort, {SORT_OPTIONS} from '../ConceptsWidget_Sort';
import zipWith from 'lodash/zipWith';
import Fuse from 'fuse.js';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import {shallow} from 'enzyme';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    docID: 1
  })
}));

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {isAuthenticated: true},
      authService: {handleAuthentication: jest.fn()},
      oktaAuth: {
        tokenManager: {
          on: jest.fn()
        }
      }
    };
  }
}));

jest.mock('react-hook-form', () => ({
  useFormContext: () => {
    return {
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn()
    };
  }
}));

describe('<ConceptsWidget/>', () => {
  const mockDocument = {
    aggregations: {
      entities: {
        ids: [
          'UMLS:C5203676',
          'UMLS:C0042210',
          'UMLS:C0024398',
          'UMLS:C5203670',
          'UMLS:C0036397',
          'UMLS:C3273482',
          'UMLS:C0086418',
          'UMLS:C0521026',
          'UMLS:C0042776',
          'UMLS:C0042196',
          'UMLS:C1522486',
          'UMLS:C0009450',
          'UMLS:C0008115',
          'UMLS:C0024109',
          'UMLS:C0025914',
          'UMLS:C0003062',
          'UMLS:C4042832',
          'UMLS:C0020852',
          'UMLS:C0034693',
          'UMLS:C0229671',
          'UMLS:C1615608',
          'UMLS:C0206750',
          'UMLS:C0036043',
          'UMLS:C0031354',
          'UMLS:C0520510',
          'CLO:0009524',
          'UMLS:C1524024',
          'UMLS:C1522002',
          'UMLS:C0043227',
          'UMLS:C0024400',
          'UMLS:C0025118',
          'UMLS:C0025953',
          'UMLS:C0003241',
          'UMLS:C0003261',
          'UMLS:C0015127',
          'GENEID:2290',
          'UMLS:C0032042',
          'UMLS:C0243148',
          'GENEID:6818',
          'UMLS:C0033147',
          'UMLS:C0017428',
          'UMLS:C0035668',
          'UMLS:C0743559',
          'UMLS:C1175175',
          'UMLS:C1280519',
          'UMLS:C0001551',
          'UMLS:C0033684',
          'UMLS:C0007634',
          'CHEMBL:1200574',
          'UMLS:C0819757',
          'UMLS:C0870814',
          'UMLS:C0039194',
          'UMLS:C0178602',
          'UMLS:C1175743',
          'UMLS:C0162326',
          'UMLS:C0220844',
          'UMLS:C0000876',
          'UMLS:C0042153',
          'UMLS:C0042212',
          'UMLS:C0057163',
          'UMLS:C0079189',
          'UMLS:C3714514',
          'UMLS:C0441655',
          'UMLS:C0012634',
          'UMLS:C0025919',
          'UMLS:C0007670',
          'GENEID:2487',
          'UMLS:C0022702',
          'CHEMBL:1098319',
          'UMLS:C0039421',
          'GENEID:7124',
          'UMLS:C1522005',
          'UMLS:C0243073',
          'UMLS:C0009924',
          'UMLS:C0003461',
          'UMLS:C1551395',
          'GENEID:920',
          'UMLS:C0035173',
          'UMLS:C0010076',
          'UMLS:C3890606',
          'UMLS:C0220825',
          'GENEID:55748',
          'GENEID:84618',
          'UMLS:C0003320',
          'UMLS:C0108779',
          'UMLS:C2603343',
          'UMLS:C0003316',
          'UMLS:C0523207',
          'UMLS:C0020964',
          'CHEMBL:95431',
          'UMLS:C2700409',
          'UMLS:C0349966',
          'UMLS:C0596070',
          'UMLS:C0282632',
          'CHEMBL:1200627',
          'UMLS:C0699032',
          'GENEID:925',
          'UMLS:C0012644',
          'UMLS:C0796494',
          'UMLS:C2718050',
          'UMLS:C0012652',
          'CHEMBL:288943',
          'UMLS:C0085104',
          'UMLS:C0085559',
          'UMLS:C0087111',
          'UMLS:C0175518',
          'UMLS:C0175673',
          'UMLS:C0178774',
          'UMLS:C0178784',
          'UMLS:C0185125',
          'UMLS:C0199470',
          'UMLS:C0205460',
          'UMLS:C0205466',
          'UMLS:C0205469',
          'UMLS:C0206061',
          'UMLS:C0206419',
          'UMLS:C0220806',
          'UMLS:C0220888',
          'UMLS:C0226993',
          'UMLS:C0227230',
          'UMLS:C0231224',
          'UMLS:C0242821',
          'UMLS:C0278060',
          'UMLS:C0282111',
          'UMLS:C0282291',
          'UMLS:C0333463',
          'UMLS:C0358514',
          'UMLS:C0376554',
          'UMLS:C0376705',
          'UMLS:C0392762',
          'UMLS:C0443640',
          'UMLS:C0445623',
          'UMLS:C0454690',
          'UMLS:C0456170',
          'UMLS:C0474643',
          'UMLS:C0475463',
          'UMLS:C0525038',
          'UMLS:C0543483',
          'UMLS:C0543488',
          'UMLS:C0582263',
          'UMLS:C0597357',
          'UMLS:C0599779',
          'UMLS:C0733470',
          'UMLS:C0887894',
          'UMLS:C1167622',
          'UMLS:C1262477',
          'UMLS:C1514578',
          'UMLS:C1522653',
          'UMLS:C1704463',
          'UMLS:C1704953',
          'UMLS:C1705779',
          'UMLS:C1706779',
          'UMLS:C1708031',
          'UMLS:C1882074',
          'UMLS:C1883362',
          'UMLS:C2584313',
          'UMLS:C2698636',
          'UMLS:C2931783',
          'UMLS:C3161035',
          'UMLS:C3494258',
          'UMLS:C3641255',
          'UMLS:C3698360',
          'UMLS:C4049614',
          'UMLS:C4761639',
          'UMLS:C1283004',
          'CHEMBL:12198',
          'CHEMBL:1233584',
          'CHEMBL:1380',
          'CHEMBL:274323',
          'CHEMBL:291747',
          'CHEMBL:3833310',
          'CHEMBL:466659',
          'CID:44135672',
          'CID:56841665',
          'CID:81462',
          'GENEID:10045',
          'GENEID:3458',
          'GENEID:3558',
          'GENEID:3565',
          'GENEID:3567',
          'GENEID:3569',
          'GENEID:6046',
          'GENEID:7528',
          'GENEID:8086',
          'GENEID:9241',
          'GENEID:92521',
          'UMLS:C0001486',
          'UMLS:C0001688',
          'UMLS:C0003451',
          'UMLS:C0005525',
          'UMLS:C0005553',
          'UMLS:C0005767',
          'UMLS:C0006104',
          'UMLS:C0007578',
          'UMLS:C0007752',
          'UMLS:C0007872',
          'UMLS:C0008550',
          'UMLS:C0008903',
          'UMLS:C0009449',
          'UMLS:C0009993',
          'UMLS:C0010453',
          'UMLS:C0011065',
          'UMLS:C0012764',
          'UMLS:C0013168',
          'UMLS:C0013182',
          'UMLS:C0013227',
          'UMLS:C0013849',
          'UMLS:C0013852',
          'UMLS:C0014441',
          'UMLS:C0014508',
          'UMLS:C0015967',
          'UMLS:C0016107',
          'UMLS:C0016262',
          'UMLS:C0016452',
          'UMLS:C0017243',
          'UMLS:C0018684',
          'UMLS:C0018787',
          'UMLS:C0018894',
          'UMLS:C0018941',
          'UMLS:C0020967',
          'UMLS:C0020971',
          'UMLS:C0020975',
          'UMLS:C0021075',
          'UMLS:C0021135',
          'UMLS:C0021228',
          'UMLS:C0021368',
          'UMLS:C0021562',
          'UMLS:C0021764',
          'UMLS:C0022277',
          'UMLS:C0022646',
          'UMLS:C0023884',
          'UMLS:C0024264',
          'UMLS:C0025255',
          'UMLS:C0026019',
          'UMLS:C0026068',
          'UMLS:C0026454',
          'UMLS:C0026882',
          'UMLS:C0027450',
          'UMLS:C0027468',
          'UMLS:C0027976',
          'UMLS:C0029341',
          'UMLS:C0030348',
          'UMLS:C0032285',
          'UMLS:C0032371',
          'UMLS:C0032520',
          'UMLS:C0033161',
          'UMLS:C0033204',
          'UMLS:C0033333',
          'UMLS:C0034019',
          'UMLS:C0034189',
          'UMLS:C0035150',
          'UMLS:C0035222',
          'UMLS:C0035229',
          'UMLS:C0036658',
          'UMLS:C0037747',
          'UMLS:C0039021',
          'UMLS:C0039082',
          'UMLS:C0039269',
          'UMLS:C0039476',
          'UMLS:C0040284',
          'UMLS:C0041700',
          'UMLS:C0042769',
          'UMLS:C0042774',
          'UMLS:C0043237',
          'UMLS:C0078988',
          'UMLS:C0079720'
        ],
        count: [
          46, 25, 25, 23, 21, 20, 19, 16, 14, 13, 11, 11, 11, 11, 10, 9, 9, 8,
          8, 7, 6, 6, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ],
        names: [
          'Severe acute respiratory syndrome coronavirus 2',
          'Vaccines',
          'Macaca',
          'COVID-19',
          'Science',
          'GOPC wt Allele',
          'Homo sapiens',
          'Viral',
          'Viruses',
          'Vaccination',
          'Professional Organization or Group',
          'Communicable Diseases',
          'China',
          'Lung',
          'Mus musculus',
          'Metazoa',
          'Beijing',
          'immunoglobulin G',
          'Rattus norvegicus',
          'Serum',
          'Pandemics',
          'Coronavirus Infections',
          'Safety',
          'Pharyngeal structure',
          'Materials',
          'Vero cell',
          'analysis aspect',
          'RNA Recognition Motif',
          'Work',
          'Macaca mulatta',
          'Medicine',
          'Microbiological',
          'Antibodies',
          'Antibody Formation',
          'Etiology aspects',
          'FOXG1',
          'Placebos',
          'control aspects',
          'SULT1A3',
          'Primates',
          'Genome',
          'RNA',
          'error',
          'Severe Acute Respiratory Syndrome',
          'Effectiveness',
          'Immunologic Adjuvants',
          'Proteins',
          'Cells',
          'Sodium Chloride, Hypertonic',
          'Structure of parenchyma of lung',
          'Like',
          'T-Lymphocyte',
          'Dosage',
          'Severe acute respiratory syndrome-related coronavirus',
          'DNA Sequence',
          'growth aspects',
          'Academies',
          'utilization qualifier',
          'Vaccines, Inactivated',
          'DAV regimen',
          'cytokine',
          'Infection',
          'Activities',
          'Disease',
          'Mice, Inbred BALB C',
          'Centers for Disease Control and Prevention (U.S.)',
          'FRZB',
          'Kinetics',
          'Mesna',
          'Technology',
          'TNF',
          'immunology aspects',
          'assay qualifier',
          'Contrast Media',
          'Anus',
          'Device Alert Level - Serious',
          'CD4',
          'Research Personnel',
          'Coronaviridae',
          'EGR3 wt Allele',
          'Evaluation',
          'CNDP2',
          'NT5C1A',
          'Antigens',
          'CD3 Antigens',
          'Study',
          'Epitopes',
          'Hematoxylin and eosin stain method',
          'Immunity',
          'Carboxyamidotriazole',
          'prevention aspects',
          'Figs - dietary',
          'Americas Ethnicity',
          'Antibody-Dependent Enhancement',
          'Propiolactone',
          'Hierarchy',
          'CD8A',
          'Animal Disease Models',
          'lobe',
          'Limit of Detection',
          'Disease Outbreaks',
          'Leukotriene d4',
          'Drug Delivery Systems',
          'intensive care',
          'Therapeutic procedure',
          'Nucleus solitarius',
          'Bale out',
          'Nucleocapsid',
          'Organ',
          'Application procedure',
          'Mechanical ventilation',
          'biological',
          'virologic',
          'Pathological aspects',
          'Pneumonia, Interstitial',
          'Genus: Coronavirus',
          'Chemicals',
          'increasing incidence',
          'Tooth Crowns',
          'Body of stomach',
          'Crisis',
          'Human body',
          'Mental state',
          'Internet',
          'Trademarks',
          'Senile Plaques',
          'Diagnostic agents',
          'Knowledge',
          'Viral Load result',
          'Quantitative',
          'Specific antibody',
          'Microorganism',
          'Geographical continent',
          'Left atrial pressure',
          'Antibody titer measurement',
          'Antibodies, Neutralizing',
          'Amino Acid Substitution',
          'pathogenic aspects',
          'Interested',
          'Structural protein',
          'receptor',
          'Animal Model',
          'human leukocyte interferon',
          'Respiratory Syncytial Virus Vaccines',
          'Binding (Molecular Function)',
          'Weight decreased',
          'Province',
          'Endotracheal Route of Drug Administration',
          'ADRB2 wt Allele',
          'ANP32B wt Allele',
          'BCAR1 wt Allele',
          'AMACR wt Allele',
          'FYN wt Allele',
          'Neutral pH',
          'Total Basophil Count',
          'Discussion (communication)',
          'CDISC SEND Laboratory Animal Strain Terminology',
          'Amelogenesis imperfecta nephrocalcinosis',
          'Model',
          'Inventors',
          'Lavage Fluid',
          'Middle East respiratory syndrome-related coronavirus',
          'TSPO wt Allele',
          'Qiang Chinese',
          'PO2 measurement',
          'Alanine',
          'Isoleucine',
          'Abacavir',
          'Aspartic Acid',
          'Threonine',
          'Algeldrate',
          'Pentaerithrityl Tetranitrate',
          'DNA',
          'cyclophosphamide/doxorubicin/vincristine protocol',
          'Bistris',
          'SH2D3A',
          'IFNG',
          'IL2',
          'IL4',
          'IL5',
          'IL6',
          'BRD2',
          'YY1',
          'AAAS',
          'NOG',
          'SPECC1',
          'Adenovirus Infections',
          'aspects of adverse effects',
          'Antiviral Agents',
          'Biological Response Modifiers',
          'Biophysics',
          'Blood',
          'Brain',
          'Cell Adhesion Molecules',
          'Cercopithecidae',
          'Cervix Mucus',
          'Chromatography',
          'Taxonomic',
          'Communicable Disease Control',
          'Copyright',
          'Anthropological Culture',
          'Cessation of life',
          'District of Columbia',
          'Drug Control',
          'Drug Allergy',
          'Pharmaceutical Preparations',
          'Email',
          'Electrons',
          'Enzyme-Linked Immunosorbent Assay',
          'epidemiologic',
          'Fever',
          'filtration',
          'Flowcharts (Computer)',
          'Food',
          'Gel',
          'Health',
          'Heart',
          'Helper-Inducer T-Lymphocyte',
          'Hematologic Tests',
          'Humoral Immunity',
          'Immunization',
          'Secondary Immunization',
          'Immunosorbents',
          'In Vitro [Publication Type]',
          'Individuality',
          'Inflammation',
          'inpatient',
          'Interleukins',
          'Italy',
          'Kidney',
          'Liver',
          'Lymphocyte',
          'Tissue membrane',
          'Electron Microscopy',
          'Middle East',
          'Monoamine Oxidase',
          'Mutation',
          'National Center for Health Statistics, U.S.',
          'United States National Institutes of Health',
          'New York (geographic location)',
          'Orthomyxoviridae',
          'Papaver',
          'Pneumonia',
          'Poliomyelitis',
          'Polymerase Chain Reaction',
          'Printing',
          'Probability',
          'Program Development',
          'public health medicine (field)',
          'Pyemia',
          'Reproduction',
          'Respiratory Distress Syndrome, Adult',
          'Respiratory Insufficiency',
          'Esthesia',
          'Spain',
          'Switzerland',
          'Syndrome',
          'Talent',
          'Temperature',
          'Tissue culture',
          'United Kingdom',
          'Virus Diseases',
          'Virus Replication',
          'World Health Organization',
          'Asians',
          'Lymphocyte Subset'
        ],
        text: [
          [
            '2019-nCoV',
            'SARS-Cov-2',
            'SARS-CoV-2',
            'severe acute respiratory syndrome coronavirus 2'
          ],
          ['Vaccin', 'vaccine', 'Vaccine', 'vaccines', 'Vaccines'],
          ['macaque', 'macaques', 'Macaques'],
          [
            'coronavirus disease',
            'CoV',
            'CoV-2',
            'COVID19',
            'COVID-19',
            'SARS-CoV-2 infection',
            'SARS-CoV-2 infections'
          ],
          ['science', 'Science', 'Sciences'],
          ['fig', 'Fig'],
          ['Human', 'humans', 'patients'],
          ['viral', 'Viral', 'Viruses'],
          ['virus', 'viruses'],
          ['immunization', 'inoculation', 'vaccination'],
          ['org'],
          ['infection', 'Infection', 'infectious', 'Infectious Diseases'],
          ['China'],
          ['lung', 'lungs', 'pulmonary'],
          ['mice', 'mouse'],
          ['animal', 'Animal', 'animals', 'Animals'],
          ['Beijing', 'Peking'],
          ['IgG'],
          ['rat', 'rats', 'Wistar', 'Wistar rats'],
          ['sera', 'Sera', 'serum'],
          ['pandemic'],
          [
            'coronavirus',
            'coronavirus disease',
            'coronavirus infections',
            'MERS',
            'respiratory syndrome'
          ],
          ['safety', 'Safety'],
          ['pharyngeal', 'pharynx', 'throat'],
          ['material', 'materials', 'Materials', 'MATERIALS'],
          ['Vero cells'],
          ['analysis'],
          ['RBD'],
          ['work'],
          [
            'Macaca mulatta',
            'rhesus ma',
            'rhesus macaque monkeys',
            'rhesus macaques'
          ],
          ['Medical Sciences', 'Medicine'],
          ['Microbiol', 'Microbiology'],
          ['antibodies'],
          ['antibody', 'antibody responses'],
          ['caused'],
          ['Qin'],
          ['placebo'],
          ['control'],
          ['stm'],
          ['primate', 'primates'],
          ['genome', 'genomic'],
          ['RNA'],
          ['Error'],
          ['SARS', 'severe acute respiratory syndrome'],
          ['effective'],
          ['adjuvant'],
          ['Protein', 'proteins'],
          ['Cell'],
          ['saline'],
          ['lung tissue', 'Lung tissue'],
          ['like'],
          ['T cell'],
          ['dose'],
          ['SARS', 'SARS-CoV'],
          ['sequences'],
          ['growth', 'Growth'],
          ['Academy'],
          ['use'],
          ['inactivated vaccine'],
          ['ADE'],
          ['cytokine', 'cytokines'],
          ['infected', 'infection'],
          ['activities'],
          ['disease', 'Disease'],
          ['BALB/c'],
          [
            'Center for Disease Control',
            'Center for Disease Control and Prevention'
          ],
          ['OS1'],
          ['kinetics'],
          ['com'],
          ['technology', 'Technology'],
          ['TNF-a', 'tumor necrosis factor (TNF)-a'],
          ['Immunol'],
          ['assay'],
          ['contrast'],
          ['anal'],
          ['serious'],
          ['CD4+'],
          ['researchers'],
          ['Coronaviridae', 'family Coronaviridae'],
          ['pilot'],
          ['evaluations'],
          ['CN2'],
          ['CN1'],
          ['antigen', 'immunogen'],
          ['CD3'],
          ['study'],
          ['epitopes'],
          ['hematoxylin and eosin'],
          ['immunity', 'Immunity'],
          ['Cai'],
          ['Prevention'],
          ['figs', 'Figs'],
          ['American'],
          ['antibody-dependent', 'antibody-dependent enhancement'],
          ['b-', 'propiolactone'],
          ['tree'],
          ['CD8+'],
          ['animal', 'Animal Model'],
          ['lobes'],
          ['limit of detection'],
          ['outbreak'],
          ['Ltd'],
          ['system'],
          ['intensive care'],
          ['treatments'],
          ['NTS'],
          ['Emergency'],
          ['nucleocapsid'],
          ['organs'],
          ['applications'],
          ['mechanical ventilation'],
          ['biological'],
          ['Virol'],
          ['pathology'],
          ['interstitial'],
          ['coronaviruses'],
          ['chemically'],
          ['outbreaks'],
          ['crown'],
          ['body'],
          ['crisis'],
          ['bodies'],
          ['mental'],
          ['www'],
          ['trademark'],
          ['plaque'],
          ['diagnostic'],
          ['KNOWLED'],
          ['viral load'],
          ['quantitative'],
          ['specific antibody'],
          ['Microbe'],
          ['continents'],
          ['pla'],
          ['antibody titers'],
          ['neutralizing antibodies'],
          ['amino acid substitutions'],
          ['pathogenesis'],
          ['interests'],
          ['structural proteins'],
          ['receptor'],
          ['Animal Models'],
          ['IFN'],
          ['Respiratory Virus'],
          ['binding'],
          ['weight'],
          ['Province'],
          ['intratracheal route'],
          ['bar'],
          ['April'],
          ['CAS'],
          ['race'],
          ['syn'],
          ['neutral'],
          ['Bao'],
          ['discussion'],
          ['strain'],
          ['ers'],
          ['models'],
          ['inventors'],
          ['lavage fluid'],
          ['MERS-CoV'],
          ['ibp'],
          ['Qiang'],
          ['Bao'],
          ['Ala'],
          ['Ile'],
          ['abc'],
          ['Asp'],
          ['Thr'],
          ['alum adjuvant'],
          ['Ten'],
          ['DNA'],
          ['vac'],
          ['Bis-Tris'],
          ['nsp1'],
          ['IFN-g'],
          ['IL-2'],
          ['IL-4'],
          ['IL-5'],
          ['IL-6'],
          ['Nat'],
          ['Yin'],
          ['AAAS'],
          ['noglobulin'],
          ['nsp16'],
          ['adenovirus'],
          ['adverse'],
          ['antiviral drugs'],
          ['Immunother'],
          ['Biophysics'],
          ['blood'],
          ['brain'],
          ['CAMS'],
          ['monkeys'],
          ['caus'],
          ['chromatography'],
          ['Taxonomy'],
          ['Communicable Disease Control'],
          ['Copyright'],
          ['culture'],
          ['deaths'],
          ['Washington, DC'],
          ['Drug Control'],
          ['Allergy'],
          ['Medicine'],
          ['Email'],
          ['electron'],
          ['ELISA'],
          ['Epidemiology'],
          ['fever'],
          ['filtration'],
          ['Flowchart'],
          ['Food'],
          ['gel'],
          ['Health'],
          ['heart'],
          ['helper T-cell'],
          ['blood test'],
          ['humoral immunity'],
          ['immunizations'],
          ['booster'],
          ['immunosorbent'],
          ['in vitro'],
          ['individual differences'],
          ['inflammation'],
          ['hospital patients'],
          ['interleukin'],
          ['Italy'],
          ['kidney'],
          ['liver'],
          ['lymphocytes'],
          ['membrane'],
          ['electron microscopy'],
          ['Middle East'],
          ['Mao'],
          ['mutations'],
          ['National'],
          ['National'],
          ['New York'],
          ['influenza virus'],
          ['popula'],
          ['pneumonia'],
          ['polio'],
          ['polymerase chain reaction'],
          ['print'],
          ['likelihood'],
          ['Development Program'],
          ['Public Health'],
          ['sepsis'],
          ['reproduction'],
          ['acute respiratory distress syndrome'],
          ['respiratory failure'],
          ['sense'],
          ['Spain'],
          ['Switzerland'],
          ['genus Betacoronavirus'],
          ['Talent'],
          ['temperatures'],
          ['tissue culture'],
          ['United'],
          ['diseases caused'],
          ['viral replication'],
          ['World Health Organization'],
          ['Asian'],
          ['lymphocyte subset']
        ],
        types: [
          ['species & viruses'],
          ['chemicals & drugs'],
          ['species & viruses'],
          ['medical conditions', 'species & viruses'],
          ['context'],
          ['genetics', 'medical devices'],
          ['species & viruses'],
          ['context'],
          ['species & viruses'],
          ['medical procedures'],
          ['context'],
          ['medical conditions'],
          ['context'],
          ['anatomy & physiology'],
          ['species & viruses'],
          ['species & viruses'],
          ['context'],
          ['chemicals & drugs'],
          ['species & viruses'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['medical conditions', 'species & viruses'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['medical devices'],
          ['cell biology'],
          ['context'],
          ['genetics'],
          ['context'],
          ['species & viruses'],
          ['context'],
          ['context'],
          ['chemicals & drugs'],
          ['anatomy & physiology'],
          ['unassigned'],
          ['genetics'],
          ['medical procedures'],
          ['context'],
          ['genetics'],
          ['species & viruses'],
          ['genetics', 'unassigned'],
          ['genetics'],
          ['context'],
          ['medical conditions', 'species & viruses'],
          ['unassigned'],
          ['chemicals & drugs'],
          ['genetics'],
          ['cell biology'],
          ['chemicals & drugs'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['cell biology'],
          ['unassigned'],
          ['medical conditions', 'species & viruses'],
          ['genetics'],
          ['anatomy & physiology'],
          ['context'],
          ['context'],
          ['chemicals & drugs'],
          ['medical procedures'],
          ['genetics'],
          ['medical conditions'],
          ['context'],
          ['medical conditions'],
          ['species & viruses'],
          ['context'],
          ['genetics'],
          ['anatomy & physiology'],
          ['chemicals & drugs'],
          ['context'],
          ['genetics'],
          ['context'],
          ['context'],
          ['chemicals & drugs'],
          ['anatomy & physiology'],
          ['unassigned'],
          ['genetics'],
          ['context'],
          ['species & viruses'],
          ['genetics'],
          ['medical procedures'],
          ['genetics'],
          ['genetics'],
          ['chemicals & drugs'],
          ['genetics'],
          ['medical procedures'],
          ['chemicals & drugs'],
          ['medical procedures'],
          ['anatomy & physiology'],
          ['chemicals & drugs', 'genetics'],
          ['context'],
          ['medical devices'],
          ['context'],
          ['medical conditions'],
          ['chemicals & drugs'],
          ['context'],
          ['genetics'],
          ['medical conditions'],
          ['anatomy & physiology'],
          ['context'],
          ['anatomy & physiology'],
          ['chemicals & drugs'],
          ['medical devices'],
          ['medical procedures'],
          ['medical procedures'],
          ['anatomy & physiology'],
          ['context'],
          ['genetics'],
          ['anatomy & physiology'],
          ['medical procedures'],
          ['medical procedures'],
          ['context'],
          ['context'],
          ['context'],
          ['medical conditions'],
          ['species & viruses'],
          ['chemicals & drugs'],
          ['context'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['medical conditions'],
          ['context'],
          ['medical conditions'],
          ['medical devices'],
          ['context'],
          ['medical conditions'],
          ['chemicals & drugs'],
          ['context'],
          ['medical conditions'],
          ['context'],
          ['genetics'],
          ['species & viruses'],
          ['context'],
          ['anatomy & physiology'],
          ['medical procedures'],
          ['genetics'],
          ['anatomy & physiology'],
          ['context'],
          ['anatomy & physiology'],
          ['genetics'],
          ['genetics'],
          ['species & viruses'],
          ['chemicals & drugs'],
          ['species & viruses'],
          ['anatomy & physiology'],
          ['medical conditions'],
          ['context'],
          ['context'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['context'],
          ['genetics'],
          ['context'],
          ['context'],
          ['genetics'],
          ['context'],
          ['context'],
          ['anatomy & physiology'],
          ['species & viruses'],
          ['chemicals & drugs'],
          ['context'],
          ['medical procedures'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['genetics'],
          ['medical conditions'],
          ['genetics'],
          ['genetics'],
          ['medical conditions'],
          ['context'],
          ['chemicals & drugs'],
          ['chemicals & drugs'],
          ['context'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['genetics'],
          ['species & viruses'],
          ['anatomy & physiology'],
          ['medical procedures'],
          ['context'],
          ['medical procedures'],
          ['context'],
          ['context'],
          ['anatomy & physiology'],
          ['context'],
          ['context'],
          ['medical conditions'],
          ['chemicals & drugs'],
          ['context'],
          ['chemicals & drugs'],
          ['medical procedures'],
          ['context'],
          ['medical conditions'],
          ['anatomy & physiology'],
          ['context'],
          ['medical devices'],
          ['chemicals & drugs'],
          ['context'],
          ['anatomy & physiology'],
          ['cell biology'],
          ['medical procedures'],
          ['anatomy & physiology'],
          ['medical procedures'],
          ['medical procedures'],
          ['chemicals & drugs'],
          ['context'],
          ['context'],
          ['medical conditions'],
          ['context'],
          ['genetics'],
          ['context'],
          ['anatomy & physiology'],
          ['anatomy & physiology'],
          ['cell biology'],
          ['anatomy & physiology'],
          ['medical procedures'],
          ['context'],
          ['genetics'],
          ['anatomy & physiology'],
          ['context'],
          ['context'],
          ['context'],
          ['species & viruses'],
          ['species & viruses'],
          ['medical conditions'],
          ['medical conditions'],
          ['medical procedures'],
          ['context'],
          ['context'],
          ['medical procedures'],
          ['context'],
          ['medical conditions'],
          ['anatomy & physiology'],
          ['medical conditions'],
          ['medical conditions'],
          ['anatomy & physiology'],
          ['context'],
          ['context'],
          ['species & viruses'],
          ['anatomy & physiology'],
          ['context'],
          ['medical procedures'],
          ['context'],
          ['medical conditions'],
          ['anatomy & physiology'],
          ['context'],
          ['context'],
          ['context']
        ]
      },
      confidence_scores: [
        {
          type: 'very_low',
          count_raw: 31
        },
        {
          type: 'high',
          count_raw: 56
        },
        {
          type: 'moderate',
          count_raw: 46
        },
        {
          type: 'low',
          count_raw: 22
        },
        {
          type: 'very_high',
          count_raw: 569
        }
      ],
      entity_types: [
        {
          type: 'context',
          count_raw: 168,
          count_unique: 71
        },
        {
          type: 'species & viruses',
          count_raw: 162,
          count_unique: 24
        },
        {
          type: 'genetics',
          count_raw: 88,
          count_unique: 43
        },
        {
          type: 'anatomy & physiology',
          count_raw: 81,
          count_unique: 38
        },
        {
          type: 'chemicals & drugs',
          count_raw: 80,
          count_unique: 33
        },
        {
          type: 'medical conditions',
          count_raw: 63,
          count_unique: 26
        },
        {
          type: 'medical procedures',
          count_raw: 42,
          count_unique: 22
        },
        {
          type: 'unassigned',
          count_raw: 16,
          count_unique: 5
        },
        {
          type: 'cell biology',
          count_raw: 13,
          count_unique: 5
        },
        {
          type: 'medical devices',
          count_raw: 11,
          count_unique: 6
        }
      ],
      progress: {
        count: [0, 708, 0, 16],
        status: ['ACCEPTED', 'NOT_REVIEWED', 'REJECTED', 'MANUAL'],
        total: 724
      },
      top_entity: {
        id: 'UMLS:C5203676',
        count: 46,
        name: 'Severe acute respiratory syndrome coronavirus 2',
        text: [
          '2019-nCoV',
          'SARS-Cov-2',
          'SARS-CoV-2',
          'severe acute respiratory syndrome coronavirus 2'
        ],
        type: ['species & viruses']
      }
    }
  };

  const entitiesObj = zipWith(
    mockDocument.aggregations.entities.names,
    mockDocument.aggregations.entities.count,
    mockDocument.aggregations.entities.types,
    mockDocument.aggregations.entities.ids,
    (name, count, type, canonical_id) => {
      return {
        name: name,
        count: count,
        type: type,
        canonical_id: canonical_id
      };
    }
  );

  const searchIndex = new Fuse(entitiesObj, {keys: ['name'], threshold: 0.1});

  it('Renders without crashing', () => {
    const comp = shallow(<ConceptsWidget />);

    expect(comp).toHaveLength(1);
  });

  it('Renders <ConceptsWidget_Sort/> without crashing', () => {
    const comp = shallow(<ConceptsWidget_Sort onSortChange={jest.fn()} />);

    expect(comp).toHaveLength(1);
  });

  describe('Search', () => {
    it('Search for " " or "" should return default collapsed results sorted by "count" descending', () => {
      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[0].value; //Default: count descending
      const filterOpen = false; //Default, collapsed view of 5 Max
      let searchQuery = ' ';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      const expectedValue = reverse(
        sortBy(entitiesObj, (o) => o[sort.key])
      ).slice(0, 5);

      const spaceResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(spaceResults.entitiesToRender).toEqual(
        expect.arrayContaining(expectedValue)
      );
      expect(spaceResults.searchEntitiesToRender).toStrictEqual([]);

      searchQuery = '';

      let emptyResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(emptyResults.entitiesToRender).toEqual(
        expect.arrayContaining(
          reverse(sortBy(entitiesObj, (o) => o[sort.key])).slice(0, 5)
        )
      );
      expect(emptyResults.searchEntitiesToRender).toStrictEqual([]);
    });

    it('Search for " " or "" should return default expanded results sorted by "count" descending', () => {
      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[0].value; //Default: count descending
      const filterOpen = true; //Expanded view
      let searchQuery = ' ';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let spaceResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(spaceResults.entitiesToRender).toEqual(
        expect.arrayContaining(
          reverse(sortBy(entitiesObj, (o) => o[sort.key])).slice(0, 5)
        )
      );
      expect(spaceResults.searchEntitiesToRender).toStrictEqual([]);

      searchQuery = ' ';

      let emptyResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(emptyResults.entitiesToRender).toEqual(
        expect.arrayContaining(reverse(sortBy(entitiesObj, (o) => o[sort.key])))
      );
      expect(emptyResults.searchEntitiesToRender).toStrictEqual([]);
    });

    it('Search for "vac" or "Vac" or "VAC" should return the same 3 canonical_ids', () => {
      const expectedSearchResult = [
        'UMLS:C0042210',
        'UMLS:C0042196',
        'UMLS:C0042212'
      ];

      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[0].value; //Default: count descending
      const filterOpen = true; //Expanded view
      let searchQuery = 'vac';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let lowercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(lowercaseResults.searchEntitiesToRender).toEqual(
        expectedSearchResult
      );

      searchQuery = 'Vac';

      let capitalizedResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(capitalizedResults.searchEntitiesToRender).toEqual(
        expectedSearchResult
      );

      searchQuery = 'VAC';

      let uppercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(uppercaseResults.searchEntitiesToRender).toEqual(
        expectedSearchResult
      );
    });

    it('Search for "Vaccine" should return only 2 canonical_ids', () => {
      const expectedSearchResult = ['UMLS:C0042210', 'UMLS:C0042212'];

      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[0].value; //Default: count descending
      const filterOpen = true; //Expanded view
      let searchQuery = 'Vaccine';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let lowercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      expect(lowercaseResults.searchEntitiesToRender).toEqual(
        expectedSearchResult
      );
    });

    it('Search for "Vaccine" should return 2 results sorted Z to A', () => {
      const expectedSearchResult = ['UMLS:C0042212', 'UMLS:C0042210'];

      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[3].value; //Z to A: name ascending
      const filterOpen = true; //Expanded view
      let searchQuery = 'Vaccine';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let lowercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      //Take entitiesToRender and filter it down to what our search canonical_id results are.
      //Then map the results down to just their canonical id for direct comparison
      //NOTE(Rejon): In the concepts widget component we render every option, but use
      //             searchEntitiesToRender to hide elements not needed. This is to avoid
      //             element keys being wrong when using the checkboxes while searching.
      let _truelyRendered = lowercaseResults.entitiesToRender
        .filter((el) =>
          lowercaseResults.searchEntitiesToRender.some(
            (ent) => el.canonical_id === ent
          )
        )
        .map((res) => res.canonical_id);

      expect(_truelyRendered).toStrictEqual(expectedSearchResult);
    });

    //NOTE(Rejon): This test is a perfect example of "entitiesToRender" being the source of truth
    //             while searchEntitiesToRender is an assortment of keys for entitiesToRender to hide
    //             when mapping through objects for the render method.
    it('Search for "Drug" sorted "count" Ascending key', () => {
      const expectedSearchResult = [
        'UMLS:C0085104',
        'UMLS:C0013168',
        'UMLS:C0013182'
      ];

      const currentFilterQuery = undefined; //{value: []}
      const sort = SORT_OPTIONS[1].value; //Lowest to Highest: count ascending
      const filterOpen = true; //Expanded view
      let searchQuery = 'Drug';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let lowercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      //Take entitiesToRender and filter it down to what our search canonical_id results are.
      //Then map the results down to just their canonical id for direct comparison
      //NOTE(Rejon): In the concepts widget component we render every option, but use
      //             searchEntitiesToRender to hide elements not needed. This is to avoid
      //             element keys being wrong when using the checkboxes while searching.

      let _truelyRendered = lowercaseResults.entitiesToRender
        .filter((el) =>
          lowercaseResults.searchEntitiesToRender.some(
            (ent) => el.canonical_id === ent
          )
        )
        .map((res) => res.canonical_id);

      expect(_truelyRendered).toStrictEqual(expectedSearchResult);
    });

    it('Handles rendering elements that have been filtered on sorted by "count" descending', () => {
      const expectedEntitiesRendered = [
        'UMLS:C0085104',
        'UMLS:C0013168',
        'UMLS:C0013182'
      ];

      const currentFilterQuery = {value: expectedEntitiesRendered};
      const sort = SORT_OPTIONS[0].value; //Lowest to Highest: count ascending
      const filterOpen = false; //Expanded view
      let searchQuery = 'Drug';
      const filterActive = currentFilterQuery !== undefined;
      const isCollapsed = !filterOpen && !filterActive;

      let lowercaseResults = queryConcepts({
        isCollapsed,
        entities: entitiesObj,
        filterActive,
        filterOpen,
        currentFilterQuery,
        sort,
        searchQuery,
        searchIndex
      });

      //Take entitiesToRender and filter it down to what our search canonical_id results are.
      //Then map the results down to just their canonical id for direct comparison
      //NOTE(Rejon): In the concepts widget component we render every option, but use
      //             searchEntitiesToRender to hide elements not needed. This is to avoid
      //             element keys being wrong when using the checkboxes while searching.

      let _truelyRendered = lowercaseResults.entitiesToRender
        .filter((el) =>
          lowercaseResults.searchEntitiesToRender.some(
            (ent) => el.canonical_id === ent
          )
        )
        .map((res) => res.canonical_id);

      expect(_truelyRendered).toStrictEqual(expectedEntitiesRendered);
    });
  });
});
