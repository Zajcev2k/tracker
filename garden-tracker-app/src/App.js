import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Separator } from './components/ui/separator';

const GardenWorkTracker = () => {
  const workTypes = [
    "Sadzenie", "Przycinanie", "Podlewanie", "Pielenie", "Nawożenie",
    "Koszenie trawy", "Grabienie", "Inne"
  ];

  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("wszystkie");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    workType: "",
    hours: "",
    minutes: "",
    cost: "",
    description: "",
  });

  useEffect(() => {
    const savedEntries = localStorage.getItem("gardenWorkEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gardenWorkEntries", JSON.stringify(entries));
  }, [entries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWorkTypeChange = (value) => {
    setFormData({
      ...formData,
      workType: value,
    });
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.workType || (!formData.hours && !formData.minutes) || !formData.date) {
      alert("Wypełnij wymagane pola: data, rodzaj pracy oraz czas (godziny lub minuty)");
      return;
    }
    
    const hours = parseInt(formData.hours) || 0;
    const minutes = parseInt(formData.minutes) || 0;
    const cost = parseFloat(formData.cost) || 0;
    
    const newEntry = {
      id: Date.now(),
      date: formData.date,
      workType: formData.workType,
      hours,
      minutes,
      totalMinutes: hours * 60 + minutes,
      cost,
      description: formData.description,
    };
    
    setEntries([...entries, newEntry]);
    
    setFormData({
      date: new Date().toISOString().split("T")[0],
      workType: "",
      hours: "",
      minutes: "",
      cost: "",
      description: "",
    });
  };

  const filteredEntries = entries.filter((entry) => {
    if (filter === "wszystkie") return true;
    return entry.workType === filter;
  });

  const totalTime = filteredEntries.reduce(
    (total, entry) => total + entry.totalMinutes,
    0
  );
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;

  const totalCost = filteredEntries.reduce(
    (total, entry) => total + entry.cost,
    0
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Śledzenie prac ogrodniczych
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Dodaj nowy wpis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workType">Rodzaj pracy</Label>
                <Select
                  value={formData.workType}
                  onValueChange={handleWorkTypeChange}
                >
                  <SelectTrigger id="workType">
                    <SelectValue placeholder="Wybierz rodzaj pracy" />
                  </SelectTrigger>
                  <SelectContent>
                    {workTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Godziny</Label>
                  <Input
                    id="hours"
                    name="hours"
                    type="number"
                    min="0"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minuty</Label>
                  <Input
                    id="minutes"
                    name="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={formData.minutes}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Koszt (PLN)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis (opcjonalnie)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Dodatkowe informacje..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Dodaj wpis
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Historia prac ogrodniczych</CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="filter" className="whitespace-nowrap">
                  Filtruj:
                </Label>
                <Select value={filter} onValueChange={handleFilterChange}>
                  <SelectTrigger id="filter" className="w-[180px]">
                    <SelectValue placeholder="Wszystkie typy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wszystkie">Wszystkie typy</SelectItem>
                    {workTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Brak wpisów. Dodaj pierwszy wpis za pomocą formularza.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Rodzaj pracy</TableHead>
                        <TableHead>Czas</TableHead>
                        <TableHead className="text-right">Koszt (PLN)</TableHead>
                        <TableHead>Opis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.workType}</TableCell>
                          <TableCell>
                            {entry.hours > 0 && `${entry.hours} godz. `}
                            {entry.minutes > 0 && `${entry.minutes} min.`}
                          </TableCell>
                          <TableCell className="text-right">{entry.cost.toFixed(2)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {entry.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Całkowity czas:</h3>
                    <p className="text-2xl font-bold">
                      {totalHours} godz. {totalMinutes} min.
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Całkowity koszt:</h3>
                    <p className="text-2xl font-bold">{totalCost.toFixed(2)} PLN</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GardenWorkTracker;