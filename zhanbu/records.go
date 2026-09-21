package zhanbu

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type DivinationRecord struct {
	ID            string         `json:"id"`
	UpperGua      int            `json:"upperGua"`
	LowerGua      int            `json:"lowerGua"`
	MovingDetails []MovingDetail `json:"movingDetails"`
	Method        string         `json:"method"`
	Question      string         `json:"question"`
	CreatedAt     string         `json:"createdAt"`
}

type MovingDetail struct {
	Position int `json:"position"`
	Type     int `json:"type"`
}

type MeihuaRecord struct {
	ID          string `json:"id"`
	UpperNum    int    `json:"upperNum"`
	LowerNum    int    `json:"lowerNum"`
	MovingYao   int    `json:"movingYao"`
	Method      string `json:"method"`
	Question    string `json:"question"`
	ManualLines []int  `json:"manualLines,omitempty"`
	CreatedAt   string `json:"createdAt"`
}

func (a *App) getRecordsFilePath() string {
	home, _ := os.UserHomeDir()
	dataDir := filepath.Join(home, ".windnote")
	os.MkdirAll(dataDir, 0755)
	return filepath.Join(dataDir, "divination_records.json")
}

func (a *App) getMeihuaRecordsFilePath() string {
	home, _ := os.UserHomeDir()
	dataDir := filepath.Join(home, ".windnote")
	os.MkdirAll(dataDir, 0755)
	return filepath.Join(dataDir, "meihua_records.json")
}

func (a *App) SaveDivinationRecord(recordJson string) error {
	filePath := a.getRecordsFilePath()

	var newRecord DivinationRecord
	if err := json.Unmarshal([]byte(recordJson), &newRecord); err != nil {
		return fmt.Errorf("failed to parse record: %w", err)
	}

	var records []DivinationRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	records = append(records, newRecord)

	data, err := json.MarshalIndent(records, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal records: %w", err)
	}

	return os.WriteFile(filePath, data, 0644)
}

func (a *App) GetDivinationRecords() (string, error) {
	filePath := a.getRecordsFilePath()

	var records []DivinationRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	result, err := json.Marshal(records)
	if err != nil {
		return "[]", err
	}
	return string(result), nil
}

func (a *App) SaveMeihuaRecord(recordJson string) error {
	filePath := a.getMeihuaRecordsFilePath()

	var newRecord MeihuaRecord
	if err := json.Unmarshal([]byte(recordJson), &newRecord); err != nil {
		return fmt.Errorf("failed to parse record: %w", err)
	}

	var records []MeihuaRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	records = append(records, newRecord)

	data, err := json.MarshalIndent(records, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal records: %w", err)
	}

	return os.WriteFile(filePath, data, 0644)
}

func (a *App) GetMeihuaRecords() (string, error) {
	filePath := a.getMeihuaRecordsFilePath()

	var records []MeihuaRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	result, err := json.Marshal(records)
	if err != nil {
		return "[]", err
	}
	return string(result), nil
}

func (a *App) DeleteDivinationRecord(id string) error {
	filePath := a.getRecordsFilePath()

	var records []DivinationRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	filtered := make([]DivinationRecord, 0, len(records))
	for _, record := range records {
		if record.ID != id {
			filtered = append(filtered, record)
		}
	}

	data, err := json.MarshalIndent(filtered, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal records: %w", err)
	}

	return os.WriteFile(filePath, data, 0644)
}

func (a *App) DeleteMeihuaRecord(id string) error {
	filePath := a.getMeihuaRecordsFilePath()

	var records []MeihuaRecord
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &records)
	}

	filtered := make([]MeihuaRecord, 0, len(records))
	for _, record := range records {
		if record.ID != id {
			filtered = append(filtered, record)
		}
	}

	data, err := json.MarshalIndent(filtered, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal records: %w", err)
	}

	return os.WriteFile(filePath, data, 0644)
}
