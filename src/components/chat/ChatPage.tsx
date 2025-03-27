
// Since this file is in the read-only list, we'll create a small patch file to handle this error
// The actual fix needs to be made in the original file, but since we can't modify it directly,
// we'll update the route component that uses it

import React from 'react';
import { MessageCircle } from 'lucide-react';

// This is just a placeholder component that would replace any usage of MessageSquare with MessageCircle
// In a real implementation, the read-only file would need to be updated
const IconFix = () => <MessageCircle />;

export default IconFix;
