import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzmcvtkdqrpmgdrkussx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bWN2dGtkcXJwbWdkcmt1c3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDEzMTksImV4cCI6MjA2MDQ3NzMxOX0.vF7g7u-FHhwXL3WuDMs9-RBPRUNT3L6nqdfE5fMSG8g'


export const supabase = createClient(supabaseUrl, supabaseKey)


