"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { addCopyToCampaign, CopyPayload } from "@/lib/firebase/copies";
import { getCampaigns } from "@/lib/firebase/campanhas";
import { Loader2, Save } from "lucide-react";

type Props = {
  disabled?: boolean;
  defaultTitle?: string;
  payload: CopyPayload; // o conteúdo que será salvo
};

export default function SaveToCampaign({ disabled, defaultTitle = "Criativo IA", payload }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    (async () => {
      try {
        const c = await getCampaigns();
        setCampaigns(c || []);
        if (c?.[0]?.id) setCampaignId(c[0].id);
      } catch (e) {
        // noop
      }
    })();
  }, []);

  async function handleSave() {
    if (!campaignId) {
      toast({ title: "Escolha uma campanha", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await addCopyToCampaign(campaignId, { ...payload, title });
      toast({ title: "Salvo na campanha!" });
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: String(e?.message || e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="secondary">
          <Save className="h-4 w-4 mr-2" /> Salvar na campanha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar criativo na campanha</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-slate-600 mb-1">Título interno</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Headline conversão - versão A" />
          </div>

          <div>
            <div className="text-sm text-slate-600 mb-1">Campanha</div>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full rounded-md bg-white text-slate-900 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome || c.title || "Campanha"} ({(c.status || "ativo").toLowerCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
