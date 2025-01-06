import { Frequency, Medications } from "@/types/Medications";
import React, { useState, useEffect } from "react";

interface DrugAutocompleteProps {
    onSelect: (medication: Medications) => void;
    onCancel?: () => void;
    initialValue?: Medications;
}

const DrugAutocomplete: React.FC<DrugAutocompleteProps> = ({ onSelect, onCancel, initialValue }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue?.name || "");
    const [selectedDrug, setSelectedDrug] = useState<string | null>(initialValue?.name || null);
    const [dosage, setDosage] = useState(initialValue?.dosage || "");
    const [frequency, setFrequency] = useState<Frequency>(initialValue?.frequency || {
        morning: false,
        afternoon: false,
        evening: false,
        night: false
    });
    const [notes, setNotes] = useState(initialValue?.notes || "");

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (!term) {
            setSelectedDrug(null);
        }
    };

    const handleSelect = (drug: string) => {
        setSelectedDrug(drug);
        setSearchTerm(drug);
    };

    const handleAdd = () => {
        if (selectedDrug) {
            const newMedication: Medications = {
                id: initialValue?.id || Date.now().toString(),
                name: selectedDrug,
                dosage,
                frequency,
                notes,
                reminders: initialValue?.reminders || []
            };
            onSelect(newMedication);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onSelect={(e) => handleSelect((e.target as HTMLInputElement).value)}
                placeholder="Search for a drug..."
                className="px-4 p-2 w-full min-w-[300px] bg-white/10 rounded-2xl"
                list="drug-list"
            />
            <datalist id="drug-list">
                <option value="Paracetamol" />
                <option value="Ibuprofen" />
                <option value="Amoxicillin" />
                <option value="Metformin" />
                <option value="Aspirin" />
                <option value="Omeprazole" />
                <option value="Losartan" />
                <option value="Gabapentin" />
                <option value="Atorvastatin" />
                <option value="Ciprofloxacin" />
                <option value="Pantoprazole" />
                <option value="Cetirizine" />
                <option value="Fluconazole" />
                <option value="Acyclovir" />
                <option value="Levothyroxine" />
                <option value="Venlafaxine" />
                <option value="Tizanidine" />
                <option value="Buspirone" />
                <option value="Lithium" />
                <option value="Citalopram" />
                <option value="Bupropion" />
                <option value="Escitalopram" />
                <option value="Mirtazapine" />
                <option value="Quetiapine" />
                <option value="Haloperidol" />
                <option value="Risperidone" />
                <option value="Fluphenazine" />
                <option value="Olanzapine" />
                <option value="Ziprasidone" />
                <option value="Aripiprazole" />
                <option value="Clozapine" />
                <option value="Prazosin" />
                <option value="Trazodone" />
                <option value="Duloxetine" />
                <option value="Venetoclax" />
                <option value="Ibrutinib" />
                <option value="Ruxolitinib" />
                <option value="Erlotinib" />
                <option value="Imatinib" />
                <option value="Gefitinib" />
                <option value="Sunitinib" />
                <option value="Sorafenib" />
                <option value="Crizotinib" />
                <option value="Dasatinib" />
                <option value="Nilotinib" />
                <option value="Palbociclib" />
                <option value="Abiraterone" />
                <option value="Enzalutamide" />
                <option value="Everolimus" />
                <option value="Temsirolimus" />
                <option value="Sirolimus" />
                <option value="Rapamycin" />
                <option value="Tacrolimus" />
                <option value="Cyclosporine" />
                <option value="Mycophenolate" />
                <option value="Azathioprine" />
                <option value="Methotrexate" />
                <option value="Leflunomide" />
                <option value="Sulfasalazine" />
                <option value="Infliximab" />
                <option value="Adalimumab" />
                <option value="Etanercept" />
                <option value="Golimumab" />
                <option value="Certolizumab" />
                <option value="Natalizumab" />
                <option value="Rituximab" />
                <option value="Bevacizumab" />
                <option value="Trastuzumab" />
                <option value="Pertuzumab" />
                <option value="Daratumumab" />
                <option value="Obinutuzumab" />
                <option value="Pembrolizumab" />
                <option value="Nivolumab" />
                <option value="Atezolizumab" />
                <option value="Durvalumab" />
                <option value="Avelumab" />
                <option value="Ipilimumab" />
                <option value="Belatacept" />
                <option value="Vedolizumab" />
                <option value="Ustekinumab" />
                <option value="Secukinumab" />
                <option value="Ixekizumab" />
                <option value="Brodalumab" />
                <option value="Sotagliflozin" />
                <option value="Canagliflozin" />
                <option value="Dapagliflozin" />
                <option value="Empagliflozin" />
                <option value="Ertugliflozin" />
                <option value="Linagliptin" />
                <option value="Saxagliptin" />
                <option value="Sitagliptin" />
                <option value="Alogliptin" />
                <option value="Vildagliptin" />
                <option value="Repaglinide" />
                <option value="Nateglinide" />
                <option value="Logistic Concentrate" />
                <option value="Glimepiride" />
                <option value="Rosiglitazone" />
                <option value="Pioglitazone" />
                <option value="Metformin Extended" />
                <option value="Glyburide" />
                <option value="Glipizide" />
                <option value="Gliclazide" />
                <option value="Insulin Glargine" />
                <option value="Insulin Detemir" />
                <option value="Insulin Degludec" />
                <option value="Insulin Lispro" />
                <option value="Insulin Aspart" />
                <option value="Insulin Glulisine" />
                <option value="Insulin Regular" />
                <option value="Insulin NPH" />
                <option value="Insulin Lente" />
                <option value="Insulin Ultralente" />
                <option value="Glucagon" />
                <option value="Epinephrine" />
                <option value="Norepinephrine" />
                <option value="Dopamine" />
                <option value="Dobutamine" />
                <option value="Isoproterenol" />
                <option value="Alteplase" />
                <option value="Tenecteplase" />
                <option value="Reteplase" />
                <option value="Streptokinase" />
                <option value="Urokinase" />
                <option value="Nafcillin" />
                <option value="Oxacillin" />
                <option value="Dicloxacillin" />
                <option value="Flucloxacillin" />
                <option value="Cloxacillin" />
                <option value="Clavulanic Acid" />
                <option value="Amoxicillin-Clavulanate" />
                <option value="Piperacillin-Tazobactam" />
                <option value="Ticarcillin-Clavulanate" />
                <option value="Aztreonam" />
                <option value="Cephalexin" />
                <option value="Cefuroxime" />
                <option value="Ceftriaxone" />
                <option value="Cefepime" />
                <option value="Ceftazidime" />
                <option value="Cefixime" />
                <option value="Cefpodoxime" />
                <option value="Cefdinir" />
                <option value="Cefaclor" />
                <option value="Cefprozil" />
                <option value="Cefadroxil" />
                <option value="Cefotaxime" />
                <option value="Cefoperazone" />
                <option value="Cefotetan" />
                <option value="Ceftibuten" />
                <option value="Cefixime" />
                <option value="Cefixime" />
                <option value="Ceftriaxone" />
                <option value="Cefazolin" />
                <option value="Cefalexin" />
                <option value="Cefarolin" />
                <option value="Cefuroxime Axetil" />
                <option value="Cefixime Proxetil" />
                <option value="Cefpodoxime Proxetil" />
                <option value="Cefdinir" />
                <option value="Cefepime" />
                <option value="Ceftazidime" />
                <option value="Ceftriaxone" />
                <option value="Cefotaxime" />
                <option value="Cefuroxime" />
                <option value="Cefixime" />
                <option value="Cefaclor" />
                <option value="Cefadroxil" />
                <option value="Cephalexin" />
                <option value="Cefprozil" />
                <option value="Cefotetan" />
                <option value="Cefoperazone" />
                <option value="Ceftibuten" />
                <option value="Cefazolin" />
                <option value="Cefalexin" />
                <option value="Cefarolin" />
                <option value="Cefixime" />
                <option value="Ceftolozane" />
                <option value="Ceftaroline" />
                <option value="Cefiderocol" />
                <option value="Azithromycin" />
                <option value="Clarithromycin" />
                <option value="Erythromycin" />
                <option value="Roxithromycin" />
                <option value="Dirithromycin" />
                <option value="Telithromycin" />
                <option value="Josamycin" />
                <option value="Spiramycin" />
                <option value="Tilmicosin" />
                <option value="Gatifloxacin" />
                <option value="Moxifloxacin" />
                <option value="Gemifloxacin" />
                <option value="Levofloxacin" />
                <option value="Ofloxacin" />
                <option value="Ciprofloxacin" />
                <option value="Norfloxacin" />
                <option value="Enrofloxacin" />
                <option value="Danofloxacin" />
                <option value="Balofloxacin" />
                <option value="Lomefloxacin" />
                <option value="Garenoxacin" />
                <option value="Pefloxacin" />
                <option value="Lefamulin" />
                <option value="Delafloxacin" />
                <option value="Nemonoxacin" />
                <option value="Sitafloxacin" />
                <option value="Finafloxacin" />
                <option value="Besifloxacin" />
                <option value="Gatifloxacin" />
                <option value="Moxifloxacin" />
                <option value="Gemifloxacin" />
                <option value="Levofloxacin" />
                <option value="Ofloxacin" />
                <option value="Ciprofloxacin" />
                <option value="Norventoin" />
                <option value="Ceftriaxone Sodium" />
                <option value="Cefoperazone Sodium" />
                <option value="Cefepime Disodium" />
                <option value="Ceftazidime" />
                <option value="Cefotaxime Sodium" />
                <option value="Cefuroxime Sodium" />
                <option value="Cefixime Dihydrate" />
                <option value="Cefdinir" />
                <option value="Cefadroxil" />
                <option value="Cefdinir" />
                <option value="Cefaclor" />
                <option value="Cefpodoxime" />
            </datalist>
            {selectedDrug && (
                <div className="mt-4 space-y-4">
                    <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="Dosage"
                        className="px-4 p-2 w-full bg-white/10 rounded-2xl"
                    />
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={frequency.morning}
                                onChange={(e) => setFrequency({ ...frequency, morning: e.target.checked })}
                                className="accent-white/10"
                            />
                            <span>Morning</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={frequency.afternoon}
                                onChange={(e) => setFrequency({ ...frequency, afternoon: e.target.checked })}
                                className="accent-white/10"
                            />
                            <span>Afternoon</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={frequency.evening}
                                onChange={(e) => setFrequency({ ...frequency, evening: e.target.checked })}
                                className="accent-white/10"
                            />
                            <span>Evening</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={frequency.night}
                                onChange={(e) => setFrequency({ ...frequency, night: e.target.checked })}
                                className="accent-white/10"
                            />
                            <span>Night</span>
                        </label>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes"
                        className="px-4 p-2 w-full bg-white/10 rounded-2xl"
                        rows={3}
                    />
                    <div className="flex gap-4 justify-end mt-4">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-white/80 heading font-semibold rounded-2xl text-background hover:bg-white/90 transition-colors"
                        >
                            {initialValue ? 'Save' : 'Add'}
                        </button>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 bg-red heading font-semibold rounded-2xl text-background hover:bg-red/90 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrugAutocomplete;
